'use strict'

const { expect } = require('code')
const { validate } = require('.')
const Joi = require('joi')

describe('config-validator', () => {
  it('returns validated values', () => {
    const result = validate('some-name', Joi.string().required(), 'hello')
    expect(result).to.equal('hello')
  })

  it('throws validation errors', () => {
    expect(() => {
      validate('some-name', Joi.number().required(), 'hello')
    }).to.throw()
  })

  it('with no options', () => {
    const result = validate('some-name', {}, undefined)
    expect(result).to.equal({})
  })

  it('with no rules', () => {
    const result = validate('some-name', null, 'hello')
    expect(result).to.equal('hello')
  })

  it('with empty rules', () => {
    const result = validate('some-name', {}, 'hello')
    expect(result).to.equal('hello')
  })
})
