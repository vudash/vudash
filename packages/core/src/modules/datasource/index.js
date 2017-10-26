'use strict'

const DummyDatasource = require('./dummy-datasource')
const validator = require('./validator')
const locator = require('./locator')

exports.load = function (widgetName, dashboard, datasourceName) {
  if (!datasourceName) {
    return new DummyDatasource({ widgetName })
  }

  const { Constructor, validation, options } = locator.locate(dashboard.datasources, datasourceName)
  const configuration = options ? validator.validate(widgetName, validation, options) : {}

  return new Constructor(configuration)
}
