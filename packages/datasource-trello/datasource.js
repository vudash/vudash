'use strict'

const TrelloTransport = require('./src/trello-transport')
const { validation } = require('./src/datasource-validation')

exports.validation = validation

exports.register = function (options) {
  return new TrelloTransport(options)
}
