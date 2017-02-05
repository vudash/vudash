'use strict'

const RestTransport = require('./src/rest-transport')

class RestDatasource {

  register (dashboard, options) {
    dashboard.contributeDatasource('rest', RestTransport)
  }
}

module.exports = RestDatasource
