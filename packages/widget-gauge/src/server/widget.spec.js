'use strict'

const { register, validation } = require('.')
const { expect } = require('code')
const Joi = require('joi')

describe('widget-gauge/widget', () => {
  context('Maximum', () => {
    it('is passed', () => {
      const config = { maximum: 46 }
      const widget = register(config)
      expect(widget.config.maximum).to.equal(config.maximum)
    })
  })

  describe('Validation', () => {
    context('Maximum', () => {
      it('is valid', () => {
        const config = { maximum: 46 }
        const { value } = Joi.validate(config, validation)
        expect(value.maximum).to.equal(config.maximum)
      })

      it('is a number', () => {
        const config = { maximum: 'abc' }
        const { error } = Joi.validate(config, validation)
        expect(error.message).to.include('"maximum" must be a number')
      })

      it('is required', () => {
        const config = {}
        const { error } = Joi.validate(config, validation)
        expect(error.message).to.include('"maximum" is required')
      })
    })
  })
})
