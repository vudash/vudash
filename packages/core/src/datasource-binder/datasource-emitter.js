'use strict'

const EventEmitter = require('events')

class DatasourceEmitter extends EventEmitter {}

exports.createEmitter = function () {
  return new DatasourceEmitter()
}
