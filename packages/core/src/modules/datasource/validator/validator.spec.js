'use strict'

const validator = require('.')
const configValidator = require('../../config-validator')
const { stub } = require('sinon')

describe('datasource.validator', () => {
  const datasourceOptions = { a: 'b' }

  before(() => {
    stub(configValidator, 'validate')
  })

  after(() => {
    configValidator.validate.restore()
  })

  it('combines all datasource options', () => {
    expect(
      validator.validate('a', { options: { c: 'd' }}, { a: 'b' })
    ).to.equal({ a: 'b', c: 'd' })
  })

  it('local options override global options', () => {
    expect(
      validator.validate('a', { options: { a: 'd', c: 'd' }}, { a: 'b' })
    ).to.equal({ a: 'b', c: 'd' })
  })

  it('validation is called if available', () => {
    validator.validate('a', { validation: {} }, {})
    expect(configValidator.validate.callCount).to.equal(1)
  })
})