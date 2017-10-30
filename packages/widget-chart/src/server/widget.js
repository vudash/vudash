'use strict'

const defaults = {
  description: '',
  labels: [],
  type: 'line'
}

class ChartWidget {
  constructor (options) {
    this.config = Object.assign({}, defaults, options)
  }

  update (data) {
    const names = Object.keys(data)
    const series = names.map(names => {
      return data[names]
    })
    return { series }
  }
}

exports.register = function (options) {
  return new ChartWidget(options)
}
