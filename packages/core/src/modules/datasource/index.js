'use strict'

const DummyDatasource = require('./dummy-datasource')
const validator = require('./validator')
const locator = require('./locator')

exports.load = function (widgetName, dashboard, datasourceDefinition) {
  if (!datasourceDefinition || !datasourceDefinition.name) {
    return new DummyDatasource({ widgetName })
  }

  const { name, options } = datasourceDefinition

  const sharedDatasource = locator.locate(dashboard.datasources, name)
  const configuration = options ? validator.validate(widgetName, sharedDatasource, options) : {}

  return new sharedDatasource.Constructor(configuration)
}
