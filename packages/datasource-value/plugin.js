'use strict'

const ValueTransport = require('./src/value-transport')
const { validation } = require('./src/datasource-validation')

class ValueDatasource {

  register (dashboard) {
    dashboard.contributeDatasource(ValueTransport, validation)
  }
}

module.exports = new ValueDatasource()
