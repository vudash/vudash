'use strict'

const Joi = require('joi')
const { applyToDefaults } = require('hoek')
const DummyDatasource = require('./dummy-datasource')
const validator = require('./validator')
const locator = require('./locator')

const defaultDatasourceValidation = {
  schedule: Joi.number().min(0).description('Datasource refresh schedule')
}

exports.load = function (widgetName, dashboard, datasourceName) {
  if (!datasourceName) {
    return new DummyDatasource({ widgetName })
  }

  const { Constructor, validation, options } = locator.locate(dashboard.datasources, datasourceName)
  const fullValidation = validation ? applyToDefaults(defaultDatasourceValidation, validation) : defaultDatasourceValidation
  const configuration = options ? validator.validate(widgetName, fullValidation, options) : {}

  return new Constructor(configuration)
}
