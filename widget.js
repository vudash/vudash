'use strict'

const Transport = require('vudash-transports')

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

  register (options) {
    const config = Object.assign({}, defaults, options)
    this.transport = Transport.configure(config['data-source'])

    return {
      config,
      markup: 'markup.html',
      update: 'update.js',
      css: 'style.css',
      schedule: config.schedule,

      job: () => {
        return this.transport
        .fetch()
        .then((percentage) => {
          return { percentage, description: config.description }
        })
      }
    }
  }

}

module.exports = ProgressWidget
