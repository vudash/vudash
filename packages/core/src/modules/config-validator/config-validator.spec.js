'use strict'

const { validate } = require('.')
const Joi = require('joi')

describe('config-validator', () => {
  it('returns validated values', (done) => {
    const result = validate('some-name', Joi.string().required(), 'hello')
    expect(result).to.equal('hello')
    done()
  })

  it('throws validation errors', (done) => {
    expect(() => {
      validate('some-name', Joi.number().required(), 'hello')
    }).to.throw()
    done()
  })
})