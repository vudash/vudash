'use strict'

const ValueTransport = require('./src/value-transport')
const { validation } = require('./src/datasource-validation')

exports.validation = validation

exports.register = function (options) {
  return new ValueTransport(options)
}
