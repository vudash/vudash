'use strict'

class DummyDatasource {
  constructor (options) {
    this.config = options
  }

  fetch () {
    throw new Error(`Widget ${this.config.widgetName} requested data, but no datasource was configured. Check the widget configuration in your dashboard config.`)
  }
}

module.exports = DummyDatasource
