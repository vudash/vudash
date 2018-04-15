'use strict'

const Joi = require('joi')
const { applyToDefaults } = require('hoek')
const DummyDatasource = require('./dummy-datasource')
const validator = require('./validator')
const locator = require('./locator')

const datasourceValidation = {
  schedule: Joi.number().min(0).description('Datasource refresh schedule')
}

function extendValidation (validation) {
  return validation
    ? applyToDefaults(datasourceValidation, validation)
    : datasourceValidation
}

function loadValidOptions (widgetName, validation, options) {
  return options
    ? validator.validate(widgetName, validation, options)
    : {}
}

exports.load = function (widgetName, dashboard, datasourceName) {
  if (!datasourceName) {
    return new DummyDatasource({ widgetName })
  }

  const { Constructor, validation, options } = locator.locate(dashboard.datasources, datasourceName)
  const datasourceValidation = extendValidation(validation)
  const config = loadValidOptions(widgetName, datasourceValidation, options)

  return new Constructor(config)
}
