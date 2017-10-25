'use strict'

const Joi = require('joi')
const { validation } = require('.')

describe('value', () => {
  context('Widget Validation', () => {
    it('Requires a value to be passed in config', () => {
      const { error } = Joi.validate({}, validation)
      expect(error).to.be.an.error(/"value" is required/)
      
    })

    const valueTypes = [ 'string', 123, Date.now(), { a: 'x' }, () => {} ]

    valueTypes.forEach((value) => {
      it(`Allows value ${typeof value} to be passed in`, () => {
        const { error } = Joi.validate({ value }, validation)
        expect(error).not.to.exist()
        
      })
    })
  })
})
