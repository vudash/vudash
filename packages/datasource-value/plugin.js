'use strict'

const ValueTransport = require('./src/value-transport')

class ValueDatasource {

  register (dashboard, options) {
    dashboard.contributeDatasource('value', ValueTransport)
  }
}

module.exports = ValueDatasource
