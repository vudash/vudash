'use strict'

const Dashboard = require(fromSrc('modules/dashboard'))
const Widget = require(fromSrc('modules/widget'))
const sinon = require('sinon')
const Path = require('path')

describe('modules.dashboard', () => {
  const emitter = {
    on: sinon.stub(),
    to: sinon.stub().returns({ emit: sinon.stub() })
  }

  const exampleWidget = { widget: resource('widgets/example') }

  it('Loads internal widgets', (done) => {
    const descriptor = {
      widgets: [
        [exampleWidget]
      ]
    }

    const dashboard = new Dashboard(descriptor, emitter)
    expect(dashboard.getWidgets().length).to.equal(1)
    expect(dashboard.getWidgets()[0][0]).to.be.an.instanceOf(Widget)
    done()
  })

  it('Loads layout', (done) => {
    const descriptor = {
      widgets: [
        [exampleWidget, exampleWidget],
        [exampleWidget]
      ]
    }

    const dashboard = new Dashboard(descriptor, emitter)
    expect(dashboard.getWidgets().length).to.equal(2)
    expect(dashboard.getWidgets()[0].length).to.equal(2)
    expect(dashboard.getWidgets()[1].length).to.equal(1)
    done()
  })

  it('Tries to load widget with invalid descriptor', (done) => {
    const badModuleName = 'something:else'
    const descriptor = {
      widgets: [
        [{ widget: badModuleName }]
      ]
    }

    function fn () {
      return new Dashboard(descriptor, emitter)
    }

    expect(fn).to.throw(Error, `Cannot find module '${Path.join(process.cwd(), badModuleName)}'`)

    done()
  })

  it('Builds a render model', (done) => {
    const descriptor = {
      widgets: [
        [exampleWidget]
      ]
    }

    const dashboard = new Dashboard(descriptor, emitter)
    const widget = dashboard.widgets[0][0]
    expect(dashboard.toRenderModel()).to.deep.equal({
      widgets: [[
        {
          js: widget.getClientsideJs(),
          css: widget.getCss(),
          markup: widget.getMarkup()
        }
      ]]
    })
    done()
  })

  it('Schedules jobs', (done) => {
    const descriptor = {
      widgets: [
        [exampleWidget]
      ]
    }

    const dashboard = new Dashboard(descriptor, emitter)
    dashboard.buildJobs()
    expect(dashboard.getJobs().length).to.equal(1)
    done()
  })
})
