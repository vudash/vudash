'use strict'

const configValidator = require('../../config-validator')
const Joi = require('joi')

const defaultSchema = {
  description: Joi.string().optional().description('Widget display label')
}

exports.validate = function (name, baseSchema, options) {
  if (!baseSchema) { return options }

  const schema = baseSchema.keys(defaultSchema)
  return configValidator.validate(name, schema, options)
}
