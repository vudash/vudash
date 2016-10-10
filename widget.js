'use strict'

const Transport = require('vudash-transports')
const defaults = {
  'description': 'Statistics',
  'schedule': 60000,
  'data-source': {
    source: 'random'
  }
}

class StatisticWidget {

  register (options) {
    const config = Object.assign({}, defaults, options)
    this.transport = Transport.configure(config['data-source'])

    return {
      config: { description: config.description },
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      clientJs: 'client.js',
      schedule: config.schedule,

      job: this.job.bind(this)
    }
  }

  job (emit) {
    return this.transport
    .fetch()
    .then((value) => {
      emit({ value: value.toString() })
    })
    .catch((e) => {
      emit({ value: '!', error: e.message })
    })
  }

}

module.exports = StatisticWidget
