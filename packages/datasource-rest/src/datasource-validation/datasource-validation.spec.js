'use strict'

const Joi = require('joi')
const { validation } = require('.')
const { expect } = require('code')

describe('datasource-rest/datasource-validation', () => {
  it('defaults method to get', () => {
    const { value } = Joi.validate({}, validation)
    expect(value.method).to.equal('get')
  })
})
