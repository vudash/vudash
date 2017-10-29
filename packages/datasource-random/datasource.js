'use strict'

const RandomTransport = require('./src/random-transport')
const { validation } = require('./src/datasource-validation')

exports.validation = validation

exports.register = function (host, options) {
  return new RandomTransport(options)
}
