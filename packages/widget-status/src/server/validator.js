'use strict'

const Joi = require('joi')
const providers = require('../providers')

function getBasicValidation () {
  const availableProviders = Object.keys(providers)

  return {
    type: Joi.string().required().only(availableProviders).description('Status page type'),
    schedule: Joi.number().optional().default(60000).describe('CI Refresh schedule'),
    config: Joi.object().optional().default({}).description('Provider configuration')
  }
}

function validate (schema, config) {
  const { error, value } = Joi.validate(config, schema)

  if (error) {
    throw new Error(`Unable to configure status widget: ${error.message}`)
  }

  return value
}

exports.validateConfig = function (options) {
  return validate(getBasicValidation(), options)
}

exports.validateProvider = function (ProviderClass, config) {
  const { configValidation } = ProviderClass
  return validate(configValidation, config)
}
