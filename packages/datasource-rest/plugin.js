'use strict'

const Joi = require('joi')
const RestTransport = require('./src/rest-transport')

class RestDatasource {
  register (dashboard, options) {
    dashboard.contributeDatasource('rest', RestTransport)
  }

  get widgetValidation () {
    return Joi.object({
      url: Joi.string().description('Url to call'),
      method: Joi.string().only('get', 'post', 'put', 'options', 'delete', 'head').description('Http Method'),
      payload: Joi.object().optional().description('request payload'),
      query: Joi.object().optional().description('query params'),
      graph: Joi.string().optional().description('Graph expression (json path) to reach json values')
    })
  }
}

module.exports = RestDatasource
