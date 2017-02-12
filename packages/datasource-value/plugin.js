'use strict'

const Joi = require('joi')

class ValueDatasource {

  get widgetValidation () {
    return Joi.object({
      value: Joi.any().required().description('Value to return')
    })
  }
}

module.exports = ValueDatasource
