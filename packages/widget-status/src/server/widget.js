'use strict'

const Joi = require('joi')
const providers = require('../providers')
const { Promise } = require('bluebird')

class StatusWidget {

  constructor () {
    this.validate = Promise.promisify(Joi.validate)
  }

  validateOptions (options) {
    const availableProviders = Object.keys(providers)

    const validation = Joi.object({
      type: Joi.string().only(availableProviders).description('Status page type')
    })

    const baseValidation = { type: options.type }
    this.validate(baseValidation, validation)

    const providerValidation = providers[options.type].configValidation
    const fullValidation = Object.assign({}, baseValidation, providerValidation)
    this.validate(options, fullValidation)
  }

  register (options) {
    this.validateOptions(options)
    const ProviderClass = providers[options.type]
    const provider = new ProviderClass(options)

    return {
      schedule: 60000,

      job: () => {
        return provider.fetch(options)
      }
    }
  }

}

module.exports = StatusWidget
