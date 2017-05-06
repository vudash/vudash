'use strict'

const DashboardBuilder = require(fromTest('util/dashboard.builder'))
const WidgetBuilder = require(fromTest('util/widget.builder'))
const Dashboard = require(fromSrc('modules/dashboard'))
const Widget = require(fromSrc('modules/widget'))
const Path = require('path')
const Promise = require('bluebird').Promise
const pluginResolver = require('./plugin-loader/plugin-resolver')
const cheerio = require('cheerio')

describe('modules.dashboard', () => {
  let io

  before((done) => {
    io = {
      on: sinon.stub(),
      to: sinon.stub().returns({ emit: sinon.stub() })
    }
    done()
  })

  after((done) => {
    io.on.reset()
    io.to.reset()
    done()
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
    before((done) => {
      const descriptor = Object.assign({}, baseDashboard, {
        widgets: [
          { position, widget: resource('widgets/example') }
        ]
      })

      dashboard = new Dashboard(descriptor, io)
      done()
    })

    it('loads correctly', (done) => {
      expect(dashboard.getWidgets().length).to.equal(1)
      expect(dashboard.getWidgets()[0]).to.be.an.instanceOf(Widget)
      done()
    })
  })

  context('Layout', () => {
    let dashboard

    before((done) => {
      const descriptor = DashboardBuilder.create()
      .addWidget()
      .addWidget()
      .addWidget()
      .build()

      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      done()
    })

    it('Loads layout', (done) => {
      expect(dashboard.getWidgets().length).to.equal(3)
      done()
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

    before((done) => {
      sinon.stub(pluginResolver, 'resolve')
      done()
    })

    beforeEach((done) => {
      pluginResolver.resolve.returns(pluginStub)
      pluginStub.register = sinon.stub()
      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      done()
    })

    after((done) => {
      pluginResolver.resolve.restore()
      done()
    })

    it('with no plugins stanza', (done) => {
      const dashboardWithoutPlugins = DashboardBuilder
        .create()
        .build()
      const instance = new Dashboard(dashboardWithoutPlugins, io)
      const fn = () => { instance.initialise() }
      expect(fn).not.to.throw()
      done()
    })

    it('Asks each plugin to register', (done) => {
      expect(pluginStub.register.callCount).to.equal(1)
      done()
    })
  })

  context('Invalid Descriptor', () => {
    const badModuleName = 'something:else'
    let fn
    before((done) => {
      const descriptor = DashboardBuilder.create()
      .addWidget({ widget: badModuleName, position })
      .build()

      fn = () => {
        return new Dashboard(descriptor, io)
      }
      done()
    })

    it('Throws error', (done) => {
      expect(fn).to.throw(Error, `Cannot find module '${Path.join(process.cwd(), badModuleName)}'`)
      done()
    })
  })

  context('Render Model', () => {
    const dashName = 'my-dash'
    let dashboard
    let renderModel

    const myWidget = WidgetBuilder.create()
    .build()

    const descriptor = DashboardBuilder.create()
    .withName(dashName)
    .addWidget(myWidget)
    .build()

    before(async (done) => {
      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      renderModel = await dashboard.toRenderModel()
      done()
    })

    it('Has dashboard name', (done) => {
      expect(renderModel.name).to.equal(dashName)
      done()
    })

    it('Has html', (done) => {
      const $ = cheerio.load(renderModel.html)
      const styleTag = $('style')
      expect(styleTag).to.exist()
      expect(styleTag.text().trim()).to.equal(`#widget-container-${dashboard.widgets[0].id}{top:0%;left:0%;width:0%;height:0%}`)
      done()
    })

    it('Has js', (done) => {
      expect(renderModel.js).to.only.include(['code', 'map'])
      done()
    })

    it('Has css', (done) => {
      expect(renderModel.css).to.equal('\nundefined')
      done()
    })
  })

  context('Scheduled Jobs', () => {
    let dashboard
    before((done) => {
      const descriptor = DashboardBuilder.create().addWidget().build()
      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      done()
    })

    it('Loads jobs', (done) => {
      expect(dashboard.getJobs().length).to.equal(1)
      done()
    })
  })

  context('Binds emitter', () => {
    let job
    let dashboard

    before((done) => {
      job = sinon.stub().returns(Promise.resolve({a: 'b'}))
      const widget = WidgetBuilder.create().withJob(job, 1).build()
      const descriptor = DashboardBuilder.create().addWidget(widget).build()
      dashboard = new Dashboard(descriptor, io)
      dashboard.emitter = { emit: sinon.stub() }
      dashboard.initialise()
      done()
    })

    after((done) => {
      job.reset()
      dashboard.emitter.emit.reset()
      done()
    })

    it('is bound correctly', (done) => {
      expect(dashboard.getJobs().length).to.equal(1)
      expect(job.callCount).to.be.above(0)
      done()
    })

    it('Emits metadata', (done) => {
      expect(dashboard.emitter.emit.callCount).to.be.above(0)
      expect(dashboard.emitter.emit.firstCall.args[1]._updated).to.be.a.string()
      done()
    })
  })
})
