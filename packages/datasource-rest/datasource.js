'use strict'

const RestTransport = require('./src/rest-transport')
const { validation } = require('./src/datasource-validation')

exports.validation = validation

exports.register = function (options) {
  return new RestTransport(options)
}
