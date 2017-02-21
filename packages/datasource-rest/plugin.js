'use strict'

const RestTransport = require('./src/rest-transport')

class RestDatasource {
  register (dashboard) {
    dashboard.contributeDatasource('rest', RestTransport)
  }
}

module.exports = new RestDatasource()
