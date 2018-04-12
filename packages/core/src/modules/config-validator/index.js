'use strict'

const Joi = require('joi')
const { ConfigurationError } = require('../../errors')

exports.validate = function (name, rules = {}, json = {}, options = {}) {
  if (!rules || (typeof rules === 'object' && !Object.keys(rules).length)) {
    return json
  }

  const { error, value } = Joi.validate(json, rules, options)
  if (error) {
    throw new ConfigurationError(
      `Could not register ${name} due to invalid configuration: ${error}`
    )
  }

  return value
}
