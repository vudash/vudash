'use strict'

const Chance = require('chance')
const Promise = require('bluebird').Promise

class RandomTransport {
  constructor (options, seed = new Date().getTime()) {
    this.config = options
    this.chance = new Chance(seed)
  }

  prepareOptions () {
    const options = this.config.method ? this.config.options : { min: 0, max: 999 }
    const args = Array.isArray(options) ? options : [options]

    if (this.config.method === 'n') {
      const functionReference = options[0]
      const referenceParts = functionReference.split('.')
      const functionName = referenceParts.length > 1 ? referenceParts[1] : referenceParts[0]
      this.validateMethod(functionName)
      args[0] = this.chance[functionName]
    }

    return {
      method: this.config.method || 'natural',
      options: args
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
    const result = this.chance[conf.method].apply(this.chance, conf.options)
    return Promise.resolve(result)
  }
}

module.exports = RandomTransport
