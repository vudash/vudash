'use strict'

const GoogleSheetsTransport = require('./google-sheets-transport')
const configValidator = require('./config-validator')

class RestDatasource {
  register (dashboard, options) {
    dashboard.contributeDatasource('google-sheets', GoogleSheetsTransport)
  }

  get widgetValidation () {
    return configValidator.widgetValidation
  }
}

module.exports = RestDatasource
