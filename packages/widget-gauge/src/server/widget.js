'use strict'

const Hoek = require('hoek')

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

  register (options, transport) {
    const overrides = Hoek.transform(options, {
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

    const config = Hoek.applyToDefaults(defaults, overrides, false)

    return {
      config,
      schedule: config.schedule,

      job: () => {
        return transport
        .fetch()
        .then((value) => {
          return { value, min: config.min, max: config.max }
        })
      }
    }
  }

}

module.exports = GaugeWidget
