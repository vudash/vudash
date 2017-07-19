'use strict'

const validator = require('.')
const configValidator = require('../../config-validator')
const { stub } = require('sinon')

describe('datasource.validator', () => {
  const datasourceOptions = { a: 'b' }

  before((done) => {
    stub(configValidator, 'validate')
    done()
  })

  after((done) => {
    configValidator.validate.restore()
    done()
  })

  it('combines all datasource options', (done) => {
    expect(
      validator.validate('a', { options: { c: 'd' }}, { a: 'b' })
    ).to.equal({ a: 'b', c: 'd' })
    done()
  })

  it('local options override global options', (done) => {
    expect(
      validator.validate('a', { options: { a: 'd', c: 'd' }}, { a: 'b' })
    ).to.equal({ a: 'b', c: 'd' })
    done()
  })

  it('validation is called if available', (done) => {
    validator.validate('a', { validation: {} }, {})
    expect(configValidator.validate.callCount).to.equal(1)
    done()
  })
})