'use strict'

const Widget = require('./widget')
const { stub } = require('sinon')
const { expect } = require('code')

describe('widget', () => {
  context('Default configuration', () => {
    const scenarios = [
      { attribute: 'description', defaultValue: '', override: 'Time taken' },
      { attribute: 'schedule', defaultValue: 60 * 1000 * 5, override: 5000 },
      { attribute: 'labels', defaultValue: [], override: ['a', 'b', 'c'] },
      { attribute: 'type', defaultValue: 'line', override: 'bar' }
    ]

    scenarios.forEach(({ attribute, defaultValue, override }) => {
      it(`Default ${attribute}`, () => {
        const widget = new Widget()
        const model = widget.register({})
        expect(model.config[attribute]).to.equal(defaultValue)
        
      })

      it(`Override ${attribute}`, () => {
        const widget = new Widget()
        const model = widget.register({ [attribute]: override })
        expect(model.config[attribute]).to.equal(override)
        
      })
    })
  })

  context('Renders data series', () => {
    let transport
    let model

    before(() => {
      const widget = new Widget()
      transport = { fetch: stub() }
      model = widget.register({}, {}, transport)
      
    })

    it('Renders multiple datasets', () => {
      const data = {
        incremental: [1, 2, 3, 4, 5, 6],
        exponential: [1, 4, 9, 16, 25, 36],
        incidental: [1, 2, 6, 12, 20, 30]
      }
      transport.fetch.resolves(data)
      return model
        .job()
        .then(result => {
          expect(result.series).to.equal([
            data.incremental,
            data.exponential,
            data.incidental
          ])
        })
    })

    it('Renders simple array dataset', () => {
      const data = [1, 4, 9, 16, 25, 36]
      transport.fetch.resolves(data)
      return model
        .job()
        .then(result => {
          expect(result.series).to.equal(data)
        })
    })
  })
})
