'use strict'

const Joi = require('joi')

module.exports.validation = {
  method: Joi.string().optional().description('Chance method name'),
  options: Joi.alternatives([
    Joi.object().optional().description('Chance method options'),
    Joi.array().optional().description('Chance method arguments')
  ])
}
