'use strict'

const Joi = require('joi')
const Hoek = require('hoek')
const engineFactory = require('../engines/factory')
const validation = require('./validation')

class CiWidget {
  constructor (options, emitter) {
    Joi.validate(options, validation, (err) => {
      if (err) { throw err }
    })

    this.emitter = emitter
    this.config = Object.assign({ branch: 'master' }, options)

    const Provider = engineFactory.getEngine(this.config.provider)
    this.provider = new Provider(this.config)
  }

  update (data) {
    return this.provider
    .fetchBuildStatus()
    .then((status) => {
      const sound = Hoek.reach(this.config, `sounds.${status}`)
      if (sound && this.previousState !== status) {
        this.emitter.emit('audio:play', { data: sound })
      }

      this.previousState = status
      return { status }
    })
  }
}

exports.register = function (options, emitter) {
  return new CiWidget(options, emitter)
}
