'use strict'

const Joi = require('joi')

module.exports.validation = {
  value: Joi.any().required().description('Value to return')
}
