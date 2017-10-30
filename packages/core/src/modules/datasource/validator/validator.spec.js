'use strict'

const validator = require('.')
const configValidator = require('../../config-validator')
const { stub } = require('sinon')
const { expect } = require('code')

describe('datasource.validator', () => {
  context('No validation specified', () => {
    let options
    beforeEach(() => {
      stub(configValidator, 'validate')
      options = validator.validate('a', null, { a: 'b' })
    })

    afterEach(() => {
      configValidator.validate.restore()
    })

    it('returns datasource options', () => {
      expect(
        options
      ).to.equal({ a: 'b' })
    })

    it('validation is not called as it does not exist', () => {
      expect(configValidator.validate.callCount).to.equal(0)
    })
  })

  context('Validation specified', () => {
    beforeEach(() => {
      stub(configValidator, 'validate')
    })

    afterEach(() => {
      configValidator.validate.restore()
    })

    it('validation is called if available', () => {
      validator.validate('a', {}, {})
      expect(configValidator.validate.callCount).to.equal(1)
    })
  })
})
