'use strict'

const RestTransport = require('./src/rest-transport')
const { validation } = require('./src/datasource-validation')

class RestDatasource {
  register (dashboard) {
    dashboard.contributeDatasource(RestTransport, validation)
  }
}

module.exports = new RestDatasource()
