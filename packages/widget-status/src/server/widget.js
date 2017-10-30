'use strict'

const providers = require('../providers')
const { validate } = require('./validator')

class StatusWidget {

  constructor (options, emitter) {
    this.emitter = emitter
    this.config = validate(options)
    const ProviderClass = providers[this.config.type]
    this.provider = new ProviderClass(options)

    this.timer = setInterval(function () {
      this.run()
    }.bind(this), this.config.schedule)
    this.run()
  }

  run () {
    return this
    .provider
    .fetch(this.config)
    .then(data => {
      this.emitter.emit('update', data)
    })
  }

  destroy () {
    clearInterval(this.timer)
  }
}

exports.register = function (options) {
  return new StatusWidget(options)
}
