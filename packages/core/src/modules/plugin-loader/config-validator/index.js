'use strict'

const Joi = require('joi')
const { PluginRegistrationError } = require('../../../errors')

class PluginConfigurationValidator {
  validate (rules, options) {
    const result = Joi.validate(options, rules)
    if (result.error) {
      throw new PluginRegistrationError(
        `Could not register plugin due to invalid configuration: ${result.error}`
      )
    }
    return result.value
  }
}

module.exports = new PluginConfigurationValidator()
