'use strict'

const defaults = {
  description: 'Completion',
  schedule: 30000
}

class ProgressWidget {

  register (options, emit, transport) {
    const config = Object.assign({}, defaults, options)

    return {
      config,
      schedule: config.schedule,

      job: () => {
        return transport
        .fetch()
        .then((percentage) => {
          if (percentage < 0) { percentage = 0 }
          if (percentage > 100) { percentage = 100 }
          return { percentage }
        })
      }
    }
  }

}

module.exports = ProgressWidget
