'use strict'

const providers = require('../providers')
const { validateConfig, validateProvider } = require('./validator')

class StatusWidget {

  constructor (options, emitter) {
    this.emitter = emitter

    const { type, schedule, config } = validateConfig(options)
    const ProviderClass = providers[type]

    const providerConfig = validateProvider(ProviderClass, config)
    this.provider = new ProviderClass(providerConfig)

    this.timer = setInterval(function () {
      this.run()
    }.bind(this), schedule)
    this.run()
  }

  run () {
    return this
    .provider
    .fetch()
    .then(data => {
      this.emitter.emit('update', data)
    })
  }

  destroy () {
    clearInterval(this.timer)
  }
}

exports.register = function (options, emitter) {
  return new StatusWidget(options, emitter)
}
