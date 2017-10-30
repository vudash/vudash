'use strict'

const GoogleSheetsTransport = require('./src/google-sheets-transport')
const { validation } = require('./src/config-validator')

exports.validation = validation

exports.register = function (options) {
  return new GoogleSheetsTransport(options)
}
