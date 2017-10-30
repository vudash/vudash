'use strict'

const { Promise } = require('bluebird')
const Joi = require('joi')
const providers = require('../providers')
const validate = Promise.promisify(Joi.validate)

exports.validate = function (options) {
  const availableProviders = Object.keys(providers)

  const validation = Joi.object({
    type: Joi.string().only(availableProviders).description('Status page type')
  })

  const baseValidation = { type: options.type }
  validate(baseValidation, validation)

  const providerValidation = providers[options.type].configValidation
  const fullValidation = Object.assign({}, baseValidation, providerValidation)
  validate(options, fullValidation)
}
