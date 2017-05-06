'use strict'

const Widget = require('./widget')

describe.only('widget', () => {
  context('Default configuration', () => {
    const scenarios = [
      { attribute: 'description', defaultValue: '', override: 'Time taken' }
    ]

    scenarios.forEach(({ attribute, defaultValue, override }) => {
      it(`Default ${attribute}`, done => {
        const widget = new Widget()
        const model = widget.register({})
        expect(model.config[attribute]).to.equal(defaultValue)
        done()
      })

      it(`Override ${attribute}`, done => {
        const widget = new Widget()
        const model = widget.register({ [attribute]: override })
        expect(model.config[attribute]).to.equal(override)
        done()
      })
    })
  })
})
