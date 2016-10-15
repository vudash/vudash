'use strict'

const sprintf = require('sprintf-js').sprintf

const Transport = require('vudash-transports')
const defaults = {
  'description': 'Statistics',
  'schedule': 60000,
  'format': '%s',
  'data-source': {
    source: 'random'
  }
}

class StatisticWidget {

  register (options) {
    const config = this.config = Object.assign({}, defaults, options)
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
      emit({ value: this._format(value) })
    })
    .catch((e) => {
      console.error(e)
      emit({ value: '!', error: e.message })
    })
  }

  _format (value) {
    return sprintf(this.config.format, value)
  }

}

module.exports = StatisticWidget
