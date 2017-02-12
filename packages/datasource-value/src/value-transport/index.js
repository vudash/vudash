'use strict'

const Promise = require('bluebird').Promise

class ValueTransport {
  constructor (options) {
    this.config = options
  }

  fetch () {
    return Promise.resolve(this.config.value)
  }
}

module.exports = ValueTransport
