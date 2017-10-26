'use strict'

const Joi = require('joi')
const configUtil = require('../../test/config.util')
const sinon = require('sinon')
const validator = require('.')
const { expect } = require('code')

describe('datasource-google-sheets.config-validator', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
    
  })

  it('With invalid config', () => {
    const { error } = Joi.validate({}, validator.validation)
    expect(error).to.be.an.error(/fails because/)
    
  })

  it('With valid single-cell config', () => {
    const { error } = Joi.validate(configUtil.getSingleCellConfig(), validator.validation)
    expect(error).not.to.exist()
    
  })

  it('With valid range config', () => {
    const { error } = Joi.validate(configUtil.getRangeConfig(), validator.validation)
    expect(error).not.to.exist()
    
  })

  it('Invalid credentials file', () => {
    const credentials = 'xxx:yyy'
    const config = configUtil.getSingleCellConfig(credentials)
    const { error } = Joi.validate(config, validator.validation)
    expect(error).to.be.an.error()
    
  })
})
