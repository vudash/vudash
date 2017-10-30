'use strict'

const providers = require('../providers')
const { validate } = require('./validator')

class StatusWidget {

  constructor (options) {
    this.config = validate(options)
    const ProviderClass = providers[this.config.type]
    this.provider = new ProviderClass(options)
  }

  update () {
    return this.provider.fetch(this.config)
  }
}

exports.register = function (options) {
  return new StatusWidget(options)
}
