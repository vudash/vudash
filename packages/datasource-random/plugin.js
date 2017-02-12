'use strict'

const Joi = require('joi')
const RandomTransport = require('./src/random-transport')

class RandomDatasource {
  register (dashboard, options) {
    dashboard.contributeDatasource('random', RandomTransport)
  }

  get widgetValidation () {
    return Joi.object({
      method: Joi.string().optional().description('Chance method name'),
      options: Joi.alternatives([
        Joi.object().optional().description('Chance method options'),
        Joi.array().optional().description('Chance method arguments')
      ])
    })
  }
}

module.exports = RandomDatasource
