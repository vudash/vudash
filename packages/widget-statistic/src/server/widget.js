'use strict'

const { sprintf } = require('sprintf-js')

const defaults = {
  description: 'Statistics',
  'font-ratio': 4,
  format: '%s'
}

class StatisticWidget {
  constructor (options) {
    this.config = Object.assign({}, defaults, options)
  }

  update (value) {
    if (Array.isArray(value)) {
      const currentValue = value.pop()
      return { value: this._format(currentValue), history: value }
    }

    return { value: this._format(value) }
  }

  _format (value) {
    return sprintf(this.config.format, value)
  }

}

exports.register = function (options) {
  return new StatisticWidget(options)
}
