const Chance = require('chance')
const Promise = require('bluebird').Promise

const Transport = require('..')
const Joi = require('joi')

class ChanceTransport extends Transport {
  constructor (descriptor, seed) {
    super(descriptor)
    this.chance = new Chance(seed)
  }

  get configValidation () {
    return Joi.object({
      method: Joi.string().optional().description('Chance method name'),
      options: Joi.object().optional().description('Chance method options')
    })
  }

  prepareOptions () {
    return {
      method: this.config.method || 'natural',
      options: this.config.method ? this.config.options : { min: 0, max: 999 }
    }
  }

  validateMethod (method) {
    if (typeof this.chance[method] !== 'function') {
      throw new Error(`${method} is not a known chance method`)
    }
  }

  fetch () {
    const conf = this.prepareOptions()
    this.validateMethod(conf.method)
    const result = this.chance[conf.method](conf.options)
    return Promise.resolve(result)
  }
}

module.exports = ChanceTransport
