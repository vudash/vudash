const DashboardBuilder = require(fromTest('util/dashboard.builder'))
const WidgetBuilder = require(fromTest('util/widget.builder'))
const Dashboard = require(fromSrc('modules/dashboard'))
const Widget = require(fromSrc('modules/widget'))
const Path = require('path')
const Promise = require('bluebird').Promise

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

  context('Load from local module', () => {
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

  context('Assets', () => {
    let dashboard
    let assets

    before((done) => {
      const descriptor = DashboardBuilder.create()
      .addJsAsset('some-asset.js')
      .addJsAsset('https://example.net/some.js')
      .addCssAsset('some-asset.css')
      .addCssAsset('https://example.net/some.css')
      .build()

      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      assets = dashboard.getAssets()
      done()
    })

    it('Js Asset is present', (done) => {
      expect(assets.js.length).to.equal(2)
      done()
    })

    it('Css Asset is present', (done) => {
      expect(assets.css.length).to.equal(2)
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
    let renderModel
    const js = 'my-js'
    const dashName = 'my-dash'

    before((done) => {
      const myWidget = WidgetBuilder.create()
      .withJs(js)
      .build()

      const descriptor = DashboardBuilder.create()
      .withName(dashName)
      .addWidget(myWidget)
      .build()

      const dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      renderModel = dashboard.toRenderModel()
      done()
    })

    it('Is built correctly', (done) => {
      expect(renderModel.name).to.equal(dashName)
      expect(renderModel.widgets[0].css).to.exist()
      expect(renderModel.widgets[0].markup).to.exist()
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
      expect(dashboard.emitter.emit.firstCall.args[1]._updated).to.be.an.instanceOf(Date)
      done()
    })
  })
})
