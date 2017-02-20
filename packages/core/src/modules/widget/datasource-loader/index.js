'use strict'

const datasourceLocator = require('./datasource-locator')
const configValidator = require('../../config-validator')

class DatasourceLoader {
  load (widgetName, dashboard, datasource) {
    if (!datasource) {
      console.info(`${widgetName} does not have any datasource configuration.`)
      return null
    }

    const { constructor, options } = datasourceLocator.locate(dashboard.datasources, datasource.name)

    const validation = constructor.widgetValidation

    if (validation) {
      configValidator.validate(`widget:${widgetName}`, validation, datasource.options)
    }

    return new constructor(options)
  }
}

module.exports = new DatasourceLoader()
