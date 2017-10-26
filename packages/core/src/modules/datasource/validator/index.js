'use strict'

const configValidator = require('../../config-validator')
const { applyToDefaults } = require('hoek')

exports.validate = function (widgetName, validation, options = {}) {
  return validation 
    ? configValidator.validate(`widget:${widgetName}`, validation, options)
    : options
}
