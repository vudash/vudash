'use strict'

const configValidator = require('../../config-validator')

exports.validate = function (name, schema, options) {
  if (!schema) { return options }
  return configValidator.validate(name, schema, options)
}
