'use strict'

const RandomTransport = require('./src/random-transport')
const { validation } = require('./src/datasource-validation')

exports.validation = validation

exports.register = function (options) {
  return new RandomTransport(options)
}
