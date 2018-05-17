'use strict'

const { sprintf } = require('sprintf-js')
const Joi = require('joi')

const defaults = {
  description: 'Statistics'
}

function format (format, value) {
  return sprintf(format, value)
}

class StatisticWidget {
  constructor (options) {
    this.config = Object.assign({}, defaults, options)
  }

  update (value) {
    return {
      value,
      displayValue: format(this.config.format, value)
    }
  }
}

exports.validation = Joi.object({
  format: Joi.string().optional().default('%s').description('Display format'),
  colour: Joi.string().optional().default('#fff').description('Colour'),
  description: Joi.string().optional().description('Description'),
  'font-ratio': Joi.number().default(4).description('Font ratio for display value'),
  historyView: Joi.string().only('chart', 'ticker').default('chart').description('History display format')
})

exports.register = function (options) {
  return new StatisticWidget(options)
}
