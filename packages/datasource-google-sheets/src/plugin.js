'use strict'

const GoogleSheetsTransport = require('./google-sheets-transport')

class RestDatasource {
  register (dashboard, options) {
    dashboard.contributeDatasource('google-sheets', GoogleSheetsTransport)
  }
}

module.exports = new RestDatasource()
