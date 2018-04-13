'use strict'

const Joi = require('joi')
const { applyToDefaults } = require('hoek')

const defaults = {
  maximum: 100
}

class GaugeWidget {
  constructor (options) {
    this.config = applyToDefaults(defaults, options, false)
  }

  update (value) {
    const config = this.config
    return { value, config }
  }
}

exports.validation = Joi.object({
  maximum: Joi.number().required().min(0).description('Maximum value')
})

exports.register = function (options) {
  return new GaugeWidget(options)
}
