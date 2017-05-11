'use strict'

const Promise = require('bluebird').Promise

class HealthWidget {

  register (options) {
    let on = false

    return {
      schedule: 1000,

      job: () => {
        on = !on
        return Promise.resolve({ on })
      }

    }
  }

}

module.exports = HealthWidget
