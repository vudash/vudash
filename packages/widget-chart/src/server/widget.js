'use strict'

const { Promise } = require('bluebird')

class ChartWidget {

  register (options) {
    return {
      schedule: 30000,

      job: () => {
        return Promise.resolve({})
      }

    }
  }

}

module.exports = ChartWidget
