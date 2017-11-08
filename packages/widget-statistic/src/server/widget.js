'use strict'

const { sprintf } = require('sprintf-js')

const defaults = {
  description: 'Statistics',
  'font-ratio': 4,
  format: '%s'
}

function format (format, value) {
  return sprintf(format, value)
}

class StatisticWidget {
  constructor (options) {
    this.config = Object.assign({}, defaults, options)
  }

  update (value) {
    return { value: format(this.config.format, value) }
  }
}

exports.register = function (options) {
  return new StatisticWidget(options)
}
