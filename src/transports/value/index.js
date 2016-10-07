const Promise = require('bluebird').Promise

const Transport = require('..')
const Joi = require('joi')

class ValueTransport extends Transport {
  constructor (descriptor, seed) {
    super(descriptor)
  }

  get configValidation () {
    return Joi.object({
      value: Joi.string().required().description('Value to return')
    })
  }

  fetch () {
    return Promise.resolve(this.config.value)
  }
}

module.exports = ValueTransport
