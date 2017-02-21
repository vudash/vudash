'use strict'

const Joi = require('joi')

module.exports.validation = Joi.object({
  value: Joi.any().required().description('Value to return')
})
