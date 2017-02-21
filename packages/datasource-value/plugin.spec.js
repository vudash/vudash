'use strict'

const Joi = require('joi')
const plugin = require('.')

describe('value', () => {
  context('Widget Validation', () => {
    it('Requires a value to be passed in config', (done) => {
      const { error } = Joi.validate({}, plugin.widgetValidation)
      expect(error).to.be.an.error(/"value" is required/)
      done()
    })

    const valueTypes = [ 'string', 123, Date.now(), { a: 'x' }, () => {} ]

    valueTypes.forEach((value) => {
      it(`Allows value ${typeof value} to be passed in`, (done) => {
        const { error } = Joi.validate({ value }, plugin.widgetValidation)
        expect(error).not.to.exist()
        done()
      })
    })
  })
})
