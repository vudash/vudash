'use strict'

const ValueTransport = require('./src/value-transport')

class ValueDatasource {

  register (dashboard) {
    dashboard.contributeDatasource('value', ValueTransport)
  }
}

module.exports = new ValueDatasource()
