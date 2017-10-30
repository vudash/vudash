'use strict'

const { transform, applyToDefaults } = require('hoek')

const defaults = {
  schedule: 3000,
  description: 'Gauge',
  type: 'balance',
  display: 'fill',
  min: 0,
  max: 1000,
  step: 5,
  value: 27,
  borderWidth: 0,
  indicatorWidth: 35,
  indicatorBackgroundColour: 'orange',
  indicatorColour: 'yellow',
  valueBackgroundColour: 'grey',
  valueColour: 'rgba(255,255,255,0.85)',
  valueFontSize: '65px',
  enableClipboard: false,
  'data-source': {
    source: 'random',
    options: {
      method: 'integer',
      options: [{ min: 0, max: 1000 }]
    }
  }
}

class GaugeWidget {
  constructor (options) {
    const overrides = transform(options, {
      value: 'initial-value',
      min: 'min',
      max: 'max',
      schedule: 'schedule',
      indicatorBackgroundColour: 'pointer.background-colour',
      indicatorColour: 'pointer.colour',
      valueFontSize: 'value.font-size',
      valueColour: 'value.colour',
      valueBackgroundColour: 'value.background-colour',
      description: 'description'
    })

    this.config = applyToDefaults(defaults, overrides, false)
  }

  update (value) {
    const { min, max } = this.config
    return { value, min, max }
  }
}

exports.register = function (options) {
  return new GaugeWidget(options)
}
