'use strict'

const DashboardBuilder = require('util/dashboard.builder')
const WidgetBuilder = require('util/widget.builder')
const Dashboard = require('modules/dashboard')
const Widget = require('modules/widget')
const Path = require('path')
const { Promise } = require('bluebird')
const resolver = require('../resolver')
const cheerio = require('cheerio')
const bundler = require('./bundler')
const compiler = require('./compiler')
const datasourceLoader = require('../datasource-loader')
const { stub } = require('sinon')
const { expect } = require('code')

describe('modules.dashboard', () => {
  let io

  before(() => {
    io = {
      on: stub(),
      to: stub().returns({ emit: stub() })
    }
  })

  after(() => {
    io.on.reset()
    io.to.reset()
  })

  const baseDashboard = {
    layout: {
      rows: 4,
      columns: 5
    }
  }

  const position = { x: 0, y: 0, w: 0, h: 0 }

  context('Layout', () => {
    let dashboard

    before(() => {
      const descriptor = DashboardBuilder.create()
      .addWidget()
      .addWidget()
      .addWidget()
      .build()

      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
    })

    after(() => {
      dashboard.destroy()
    })

    it('Loads layout', () => {
      expect(dashboard.widgets.length).to.equal(3)
    })
  })

  describe('Datasources', () => {
    context('no datasources specified', () => {
      it('loads without issue', () => {
        const descriptor = DashboardBuilder
          .create()
          .build()

        const instance = new Dashboard(descriptor, io)
        expect(() => {
          instance.loadDatasources()
        }).not.to.throw()
      })
    })

    context('with datasources', () => {
      const datasources = { foo: 'bar' }

      beforeEach(() => {
        stub(datasourceLoader, 'load').returns(datasources)
      })

      afterEach(() => {
        datasourceLoader.load.restore()
      })

      it('loads without issue', () => {
        const descriptor = DashboardBuilder
          .create()
          .addDatasource({ baz: 'qux' })
          .build()

        const instance = new Dashboard(descriptor, io)
        instance.loadDatasources()
        expect(instance.datasources).to.equal(datasources)
      })
    })
  })

  context('Widgets', () => {
    context('no widgets specified', () => {
      it('loads without issue', () => {
        const descriptor = DashboardBuilder
          .create()
          .build()

        const instance = new Dashboard(descriptor, io)
        expect(() => {
          instance.loadWidgets()
        }).not.to.throw()
      })
    })

    context('with widgets', () => {
      const widgets = [{ foo: 'bar' }]

      beforeEach(() => {
        stub(widgetLoader, 'load').returns(widgets)
      })

      afterEach(() => {
        widgetLoader.load.restore()
      })

      it('loads without issue', () => {
        const descriptor = DashboardBuilder
          .create()
          .addWidget({ baz: 'qux' })
          .build()

        const instance = new Dashboard(descriptor, io)
        instance.loadWidgets()
        expect(instance.widgets).to.equal(widgets)
      })
    })
  })

  context('Invalid Descriptor', () => {
    const badModuleName = 'something:else'
    let fn
    before(() => {
      const descriptor = DashboardBuilder.create()
      .addWidget({ widget: badModuleName, position })
      .build()

      fn = () => {
        return new Dashboard(descriptor, io)
      }
    })

    it('throws error', () => {
      expect(fn).to.throw(Error, /could not be resolved/)
    })

    it('contains required module name', () => {
      expect(fn).to.throw(Error, /Module something:else/)
    })

    it('contains attempted path', () => {
      expect(fn).to.throw(Error, /packages\/core\/something:else/)
    })
  })

  context('Render Model', () => {
    const dashName = 'my-dash'
    const bundle = { html: 'html' }
    const compiledBundle = { js: { code: 'abc' }, css: 'xyz'}
    let dashboard
    let renderModel

    const myWidget = WidgetBuilder
    .create()
    .build()

    const descriptor = DashboardBuilder
    .create()
    .withName(dashName)
    .addWidget(myWidget)
    .build()

    before(async () => {
      stub(bundler, 'build').returns(bundle)
      stub(compiler, 'compile').resolves(compiledBundle)
      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      return dashboard
      .toRenderModel()
      .then((result) => {
        renderModel = result
      })
    })

    after(() => {
      bundler.build.restore()
      compiler.compile.restore()
      dashboard.destroy()
    })

    it('Has dashboard name', () => {
      expect(renderModel.name).to.equal(dashName)
    })

    it('Has html', () => {
      expect(renderModel.html).to.exist().and.to.equal(bundle.html)
    })

    it('Has js', () => {
      expect(renderModel.js).to.only.include(compiledBundle.js)
    })

    it('Has css', () => {
      expect(renderModel.css).to.equal('xyz\nundefined')
    })
  })

  context('Scheduled Jobs', () => {
    let dashboard
    before(() => {
      const descriptor = DashboardBuilder.create().addWidget().build()
      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
    })

    after(() => {
      dashboard.destroy()
    })

    it('Loads jobs', () => {
      expect(dashboard.jobs.length).to.equal(1)
    })
  })

  context('Binds emitter', () => {
    let job
    let dashboard

    before(() => {
      job = stub().returns(Promise.resolve({a: 'b'}))
      const widget = WidgetBuilder.create().withJob(job, 1).build()
      const descriptor = DashboardBuilder.create().addWidget(widget).build()
      dashboard = new Dashboard(descriptor, io)
      dashboard.emitter = { emit: stub() }
      dashboard.initialise()
    })

    after(() => {
      job.reset()
      dashboard.emitter.emit.reset()
      dashboard.destroy()
    })

    it('is bound correctly', () => {
      expect(dashboard.jobs.length).to.equal(1)
      expect(job.callCount).to.be.above(0)
    })

    it('Emits metadata', () => {
      expect(dashboard.emitter.emit.callCount).to.be.above(0)
      expect(dashboard.emitter.emit.firstCall.args[1]._updated).to.be.a.date()
    })
  })
})