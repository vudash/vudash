'use strict'

const Joi = require('joi')
const ValueTransport = require('./src/value-transport')

class ValueDatasource {

  register (dashboard, options) {
    dashboard.contributeDatasource('value', ValueTransport)
  }

  get widgetValidation () {
    return Joi.object({
      value: Joi.any().required().description('Value to return')
    })
  }
}

module.exports = ValueDatasource
