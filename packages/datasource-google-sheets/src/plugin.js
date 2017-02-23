'use strict'

const GoogleSheetsTransport = require('./google-sheets-transport')
const { validation } = require('./config-validator')

class RestDatasource {
  register (dashboard) {
    dashboard.contributeDatasource(GoogleSheetsTransport, validation)
  }
}

module.exports = new RestDatasource()
