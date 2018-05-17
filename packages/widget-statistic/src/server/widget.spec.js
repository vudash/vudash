'use strict'

const { expect } = require('code')
const { register, validation } = require('./widget')
const Joi = require('joi')

describe('widget', () => {
  context('#register()', () => {
    it('Uses config', () => {
      const config = { foo: 'bar' }
      const widget = register(config, validation)
      expect(widget.config.foo).to.equal(config.foo)
    })

    it('Has default config values', () => {
      const config = {}
      const widget = register(config)
      expect(widget.config.description).to.equal('Statistics')
    })

    it('Merges config with default values', () => {
      const config = { description: 'hello' }
      const widget = register(config)
      expect(widget.config.description).to.equal(config.description)
    })
  })

  context('Updates', () => {
    let output

    beforeEach(() => {
      const configuration = register({ format: '%d%%' })
      output = configuration.update(34)
    })

    it('Will convert given value to string', () => {
      const widget = register({ format: '%s' })
      const { displayValue } = widget.update(2)
      expect(displayValue).to.equal('2')
    })

    it('Will format according to format config', () => {
      expect(output.displayValue).to.equal('34%')
    })

    it('Will retain original value for history', () => {
      expect(output.value).to.equal(34)
    })
  })

  context('Configuration', () => {
    it('With provided colour', () => {
      const conf = { colour: '#f00' }
      const config = Joi.attempt(conf, validation)
      expect(config.colour).to.equal('#f00')
    })

    it('No colour passed', () => {
      const config = Joi.attempt({}, validation)
      expect(config.colour).to.equal('#fff')
    })

    it('default format is set', () => {
      const config = Joi.attempt({}, validation)
      expect(config.format).to.equal('%s')
    })
  })
})
