'use strict'

const { Promise } = require('bluebird')

const defaults = {
  description: '',
  schedule: 60 * 1000 * 5,
  labels: [],
  type: 'line'
}

class ChartWidget {

  register (options) {
    return {
      schedule: options.schedule,
      config: Object.assign({}, defaults, options),

      job: () => {
        return Promise.resolve({})
      }
    }
  }

}

module.exports = ChartWidget
