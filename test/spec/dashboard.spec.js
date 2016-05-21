'use strict'

const Dashboard = require(fromSrc('modules/dashboard'))
const Widget = require(fromSrc('modules/widget'))

describe('modules.dashboard', () => {
  const emit = function(val) { expect(val).to.be.an.object() }

  it('Loads internal widgets', (done) => {
    const descriptor = {
      widgets: [
        { widget: 'path:./widgets/time' }
      ]
    }

    const dashboard = new Dashboard(descriptor, emit)
    expect(dashboard.getWidgets().length).to.equal(1)
    expect(dashboard.getWidgets()[0]).to.be.an.instanceOf(Widget)
    done()

  })

  it('Tries to load widget with invalid descriptor', (done) => {
    const descriptor = {
      widgets: [
        { widget: 'something:else' }
      ]
    }

    function fn () {
      const dashboard = new Dashboard(descriptor, emit)
    }

    expect(fn).to.throw(Error, 'Widget descriptor something:else was not understood.')

    done()

  })

  it('Builds a render model', (done) => {
    const descriptor = {
      widgets: [
        { widget: 'path:widgets/time' }
      ]
    }

    const dashboard = new Dashboard(descriptor, emit)
    const widget = dashboard.widgets[0]
    expect(dashboard.toRenderModel()).to.deep.equal({
      widgets: [
        {
          js: widget.getClientsideJs(),
          css: widget.getCss(),
          markup: widget.getMarkup()
        }
      ]
    })
    done()

  })

  it('Schedules jobs', (done) => {
    const descriptor = {
      widgets: [
        { widget: 'path:widgets/time' }
      ]
    }

    const dashboard = new Dashboard(descriptor, emit)
    dashboard.buildJobs()
    const widget = dashboard.widgets[0]
    expect(dashboard.getJobs().length).to.equal(1)
    done()
  })

})
