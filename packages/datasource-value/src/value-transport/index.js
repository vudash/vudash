'use strict'

const Promise = require('bluebird').Promise
const Joi = require('joi')

class ValueTransport {
  constructor (options) {
    this.config = options
  }

  fetch () {
    return Promise.resolve(this.config.value)
  }

  static get widgetValidation () {
    return Joi.object({
      value: Joi.any().required().description('Value to return')
    })
  }
}

module.exports = ValueTransport
