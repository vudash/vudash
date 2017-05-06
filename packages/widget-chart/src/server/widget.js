'use strict'

const { Promise } = require('bluebird')

const defaults = {
  description: ''
}

class ChartWidget {

  register (options) {
    return {
      schedule: 30000,
      config: Object.assign({}, defaults, options),

      job: () => {
        return Promise.resolve({})
      }

    }
  }

}

module.exports = ChartWidget
