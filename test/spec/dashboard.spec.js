'use strict'

const Dashboard = require(fromSrc('modules/dashboard'))
const Widget = require(fromSrc('modules/widget'))

describe('modules.dashboard', () => {

  it('Loads internal widgets', (done) => {
    const descriptor = {
      widgets: [
        { widget: 'internal:time' }
      ]
    }

    const dashboard = new Dashboard(descriptor)
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
      const dashboard = new Dashboard(descriptor)
    }

    expect(fn).to.throw(Error, 'Widget descriptor something:else was not understood.')

    done()

  })

})
