'use strict'

const defaults = {
  description: 'Total Things',
  type: 'balance',
  display: 'fill',
  min: 0,
  max: 100,
  step: 5,
  value: 27,
  borderWidth: 0,
  indicatorWidth: 35,
  indicatorBackgroundColour: 'orange	',
  indicatorColour: 'yellow',
  valueBackgroundColour: 'grey',
  valueColour: 'rgba(255,255,255,0.85)',
  valueFontSize: '65px',
  enableClipboard: false
}

class GaugeWidget {

  register (options) {
    const config = Object.assign({}, defaults, options)

    return {
      config,
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      clientJs: 'client.js',
      schedule: 3000,

      job: (emit) => {
        const random = Math.random() * (100 - 1) + 1
        const percentage = Math.floor(random)
        emit({ percentage })
      }

    }
  }

}

module.exports = GaugeWidget
