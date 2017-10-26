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

  context('Local module', () => {
    let dashboard
    before(() => {
      const descriptor = Object.assign({}, baseDashboard, {
        widgets: [
          { position, widget: resource('widgets/example') }
        ]
      })

      dashboard = new Dashboard(descriptor, io)
    })

    it('loads correctly', () => {
      expect(dashboard.widgets.length).to.equal(1)
      expect(dashboard.widgets[0]).to.be.an.instanceOf(Widget)
    })
  })

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

  context('Plugin registration', () => {
    let dashboard

    const datasourceOptions = { foo: 'bar' }
    const descriptor = DashboardBuilder
      .create()
      .addPlugin('some-modulename', datasourceOptions)
      .build()
    const pluginStub = {}

    before(() => {
      stub(resolver, 'resolve')
    })

    beforeEach(() => {
      resolver.resolve.returns(pluginStub)
      pluginStub.register = stub()
      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
    })

    after(() => {
      resolver.resolve.restore()
      dashboard.destroy()
    })

    it('with no plugins stanza', () => {
      const dashboardWithoutPlugins = DashboardBuilder
        .create()
        .build()
      const instance = new Dashboard(dashboardWithoutPlugins, io)
      const fn = () => { instance.initialise() }
      expect(fn).not.to.throw()
    })

    it('Asks each plugin to register', () => {
      expect(pluginStub.register.callCount).to.equal(1)
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

    it('Throws error', () => {
      expect(fn).to.throw(Error, `Module dependency ${badModuleName} declared in widget could not be located`)
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