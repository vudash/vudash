'use strict'

const Joi = require('joi')

exports.validation = {
  url: Joi.string().description('Url to call'),
  method: Joi.string().optional().default('get').only('get', 'post', 'put', 'options', 'delete', 'head').description('Http Method'),
  headers: Joi.object().optional().description('additional headers'),
  body: Joi.object().optional().description('request body'),
  graph: Joi.string().optional().description('Graph expression (json path) to reach json values')
}
