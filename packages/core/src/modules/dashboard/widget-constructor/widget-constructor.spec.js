'use strict'

const DashboardBuilder = require(fromTest('util/dashboard.builder'))
const WidgetBuilder = require(fromTest('util/widget.builder'))
const Dashboard = require(fromSrc('modules/dashboard'))

describe('dashboard.widget-constructor', () => {
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

  context('Config', () => {
    let dashboard

    before((done) => {
      const widgetA = WidgetBuilder.create().withOptions({ uniqueParam: 'A' }).build()
      const widgetB = WidgetBuilder.create().withOptions({ uniqueParam: 'B' }).build()

      const descriptor = DashboardBuilder.create()
      .addWidget(widgetA)
      .addWidget(widgetB)
      .build()

      dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()
      done()
    })

    it('Individual widgets have config', (done) => {
      expect(dashboard.getWidgets()[0].config.uniqueParam).to.equal('A')
      expect(dashboard.getWidgets()[1].config.uniqueParam).to.equal('B')
      done()
    })
  })
})
