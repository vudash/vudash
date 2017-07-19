'use strict'

const configValidator = require('../../config-validator')
const { applyToDefaults } = require('hoek')

exports.validate = function (widgetName, sharedDatasource, localOptions = {}) {
  const { validation, options } = sharedDatasource
  const allOptions = applyToDefaults(options || {}, localOptions, true)

  return validation ? configValidator.validate(`widget:${widgetName}`, validation, allOptions) : allOptions
}
