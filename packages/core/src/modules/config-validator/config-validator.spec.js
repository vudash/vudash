'use strict'

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
})