'use strict'

const chance = require('chance')()
const { register } = require('./widget')
const { expect } = require('code')

describe('widget', () => {
  context('All Configuration Options', () => {
    let widget

    const config = {
      'initial-value': chance.integer({min: 0, max: 100}),
      min: chance.integer({min: 0, max: 100}),
      max: chance.integer({min: 0, max: 100}),
      description: chance.word(),
      pointer: {
        'background-colour': chance.color(),
        colour: chance.word()
      },
      value: {
        'font-size': `${chance.integer({min: 0, max: 100})}px`,
        colour: chance.color({ format: 'rgb' }),
        'background-colour': chance.color()
      }
    }

    before(() => {
      widget = register(config)
    })

    it('Overrides initial value', () => {
      expect(widget.config.value).to.equal(config['initial-value'])
    })

    it('Overrides minimum value', () => {
      expect(widget.config.min).to.equal(config.min)
    })

    it('Overrides maximum value', () => {
      expect(widget.config.max).to.equal(config.max)
    })

    it('Overrides description', () => {
      expect(widget.config.description).to.equal(config.description)
    })

    it('Overrides pointer background colour', () => {
      expect(widget.config.indicatorBackgroundColour).to.equal(config.pointer['background-colour'])
    })

    it('Overrides pointer background colour', () => {
      expect(widget.config.indicatorColour).to.equal(config.pointer['colour'])
    })

    it('Overrides value background colour', () => {
      expect(widget.config.valueBackgroundColour).to.equal(config.value['background-colour'])
    })

    it('Overrides value colour', () => {
      expect(widget.config.valueColour).to.equal(config.value['colour'])
    })

    it('Overrides value font size', () => {
      expect(widget.config.valueFontSize).to.equal(config.value['font-size'])
    })
  })
})
