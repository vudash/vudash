'use strict'

const { register } = require('.')
const { expect } = require('code')

describe('widget', () => {
  context('Default configuration', () => {
    const scenarios = [
      { attribute: 'description', defaultValue: '', override: 'Time taken' },
      { attribute: 'labels', defaultValue: [], override: ['a', 'b', 'c'] },
      { attribute: 'type', defaultValue: 'line', override: 'bar' }
    ]

    scenarios.forEach(({ attribute, defaultValue, override }) => {
      it(`Default ${attribute}`, () => {
        const model = register({})
        expect(model.config[attribute]).to.equal(defaultValue)
      })

      it(`Override ${attribute}`, () => {
        const model = register({ [attribute]: override })
        expect(model.config[attribute]).to.equal(override)
      })
    })
  })

  context('Renders data series', () => {
    let model

    before(() => {
      model = register({})
    })

    it('Renders multiple datasets', () => {
      const data = {
        incremental: [1, 2, 3, 4, 5, 6],
        exponential: [1, 4, 9, 16, 25, 36],
        incidental: [1, 2, 6, 12, 20, 30]
      }

      const result = model.update(data)

      expect(result.series).to.equal([
        data.incremental,
        data.exponential,
        data.incidental
      ])
    })

    it('Renders simple array dataset', () => {
      const data = [1, 4, 9, 16, 25, 36]

      const result = model.update(data)

      expect(result.series).to.equal(data)
    })
  })
})
