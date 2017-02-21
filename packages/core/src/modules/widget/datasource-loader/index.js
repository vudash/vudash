'use strict'

const datasourceLocator = require('./datasource-locator')
const configValidator = require('../../config-validator')
const { applyToDefaults } = require('hoek')

const internals = {
  validateDatasourceConfig (widgetName, sharedDatasource, localOptions = {}) {
    const validation = sharedDatasource.validation
    const options = sharedDatasource.options
    const allOptions = applyToDefaults(options, localOptions, true)

    if (validation) {
      configValidator.validate(`widget:${widgetName}`, validation, allOptions)
    }

    return allOptions
  }
}

class DatasourceLoader {
  load (widgetName, dashboard, datasourceDefinition) {
    if (!datasourceDefinition || !datasourceDefinition.name) {
      console.info(`${widgetName} does not have any datasource configuration.`)
      return null
    }

    const sharedDatasource = datasourceLocator.locate(dashboard.datasources, datasourceDefinition.name)
    const options = internals.validateDatasourceConfig(widgetName, sharedDatasource, datasourceDefinition.options)

    return new sharedDatasource.Constructor(options)
  }
}

module.exports = new DatasourceLoader()
