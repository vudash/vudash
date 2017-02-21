'use strict'

const Joi = require('joi')

module.exports.validation = Joi.object({
  url: Joi.string().description('Url to call'),
  method: Joi.string().only('get', 'post', 'put', 'options', 'delete', 'head').description('Http Method'),
  payload: Joi.object().optional().description('request payload'),
  query: Joi.object().optional().description('query params'),
  graph: Joi.string().optional().description('Graph expression (json path) to reach json values')
})
