'use strict'

const Dashboard = require(fromSrc('modules/dashboard'))
const Widget = require(fromSrc('modules/widget'))
const sinon = require('sinon')
const Path = require('path')

describe('modules.dashboard', () => {
  const io = {
    on: sinon.stub(),
    to: sinon.stub().returns({ emit: sinon.stub() })
  }

  const baseDashboard = {
    layout: {
      rows: 4,
      columns: 5
    }
  }

  const exampleWidget = { position: { x: 0, y: 0, w: 0, h: 0 }, widget: resource('widgets/example') }

  it('Loads internal widgets', (done) => {
    const descriptor = Object.assign({}, baseDashboard, {
      widgets: [
        exampleWidget
      ]
    })

    const dashboard = new Dashboard(descriptor, io)
    expect(dashboard.getWidgets().length).to.equal(1)
    expect(dashboard.getWidgets()[0]).to.be.an.instanceOf(Widget)
    done()
  })

  it('Loads layout', (done) => {
    const descriptor = Object.assign({}, baseDashboard, {
      widgets: [
        exampleWidget,
        exampleWidget,
        exampleWidget
      ]
    })

    const dashboard = new Dashboard(descriptor, io)
    expect(dashboard.getWidgets().length).to.equal(3)
    done()
  })

  it('Tries to load widget with invalid descriptor', (done) => {
    const badModuleName = 'something:else'
    const descriptor = Object.assign({}, baseDashboard, {
      widgets: [
        { widget: badModuleName }
      ]
    })

    function fn () {
      return new Dashboard(descriptor, io)
    }

    expect(fn).to.throw(Error, `Cannot find module '${Path.join(process.cwd(), badModuleName)}'`)

    done()
  })

  it('Builds a render model', (done) => {
    const descriptor = Object.assign({}, baseDashboard, {
      name: 'Foo bar qux',
      widgets: [
        exampleWidget
      ]
    })

    const dashboard = new Dashboard(descriptor, io)
    const widget = dashboard.widgets[0]
    const renderModel = dashboard.toRenderModel()
    expect(renderModel).to.deep.equal({
      name: descriptor.name,
      widgets: [
        {
          id: widget.id,
          js: widget.getJs(),
          css: widget.getCss(),
          markup: widget.getMarkup()
        }
      ]
    })
    done()
  })

  it('Schedules jobs', (done) => {
    const descriptor = Object.assign({}, baseDashboard, {
      widgets: [
        exampleWidget
      ]
    })

    const dashboard = new Dashboard(descriptor, io)
    dashboard.buildJobs()
    expect(dashboard.getJobs().length).to.equal(1)
    done()
  })
})
