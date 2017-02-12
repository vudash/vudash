'use strict'

const Joi = require('joi')
const Plugin = require('../plugin')
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
    const { error } = Joi.validate({}, validator.widgetValidation)
    expect(error).to.be.an.error(/fails because/)
    done()
  })

  it('With valid single-cell config', (done) => {
    const transport = new Plugin(configUtil.getSingleCellConfig())
    expect(transport).to.be.an.instanceOf(Plugin)
    done()
  })

  it('With valid range config', (done) => {
    const transport = new Plugin(configUtil.getRangeConfig())
    expect(transport).to.be.an.instanceOf(Plugin)
    done()
  })

  it('Invalid credentials file', (done) => {
    const credentials = 'xxx:yyy'
    const config = configUtil.getSingleCellConfig(credentials)
    const { error } = Joi.validate(config, validator.widgetValidation)
    expect(error).to.be.an.error()
    done()
  })
})
