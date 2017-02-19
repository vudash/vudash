'use strict'

const defaults = {
  'description': 'Completion',
  'schedule': 30000,
  'data-source': {
    source: 'random',
    method: 'integer',
    options: {
      min: 0,
      max: 100
    }
  }
}

class ProgressWidget {

  register (options, transport) {
    const config = Object.assign({}, defaults, options)

    return {
      config,
      schedule: config.schedule,

      job: () => {
        return transport
        .fetch()
        .then((percentage) => {
          if (percentage > 100) { percentage = 100 }
          return { percentage }
        })
      }
    }
  }

}

module.exports = ProgressWidget
