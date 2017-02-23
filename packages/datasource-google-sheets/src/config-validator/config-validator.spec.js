'use strict'

const Joi = require('joi')
const configUtil = require('../../test/config.util')
const sinon = require('sinon')
const validator = require('.')

describe('datasource-google-sheets.config-validator', () => {
  const sandbox = sinon.sandbox.create()

  afterEach((done) => {
    sandbox.restore()
    done()
  })

  it('With invalid config', (done) => {
    const { error } = Joi.validate({}, validator.validation)
    expect(error).to.be.an.error(/fails because/)
    done()
  })

  it('With valid single-cell config', (done) => {
    const { error } = Joi.validate(configUtil.getSingleCellConfig(), validator.validation)
    expect(error).not.to.exist()
    done()
  })

  it('With valid range config', (done) => {
    const { error } = Joi.validate(configUtil.getRangeConfig(), validator.validation)
    expect(error).not.to.exist()
    done()
  })

  it('Invalid credentials file', (done) => {
    const credentials = 'xxx:yyy'
    const config = configUtil.getSingleCellConfig(credentials)
    const { error } = Joi.validate(config, validator.validation)
    expect(error).to.be.an.error()
    done()
  })
})
