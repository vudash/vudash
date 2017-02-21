'use strict'

const GoogleSheetsTransport = require('./google-sheets-transport')

class RestDatasource {
  register (dashboard) {
    dashboard.contributeDatasource('google-sheets', GoogleSheetsTransport)
  }
}

module.exports = new RestDatasource()
