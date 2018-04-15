'use strict'

const resolver = require('../resolver')
const configValidator = require('../config-validator')
const Joi = require('joi')

function validate (widgetName, configuration) {
  const transformerSchema = Joi.object({
    transformer: Joi.string().required().label('Transformer module name'),
    options: Joi.object().optional().label('Transform configuration')
  })

  const schema = Joi.array().items(
    transformerSchema
  ).required()

  return configValidator.validate(widgetName, schema, configuration)
}

exports.load = function (widgetName, configuration) {
  validate(widgetName, configuration)
  return configuration.map(({ transformer, options }) => {
    const Constructor = resolver.resolve(transformer)
    return new Constructor(options)
  })
}
