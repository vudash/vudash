'use strict'

const Transport = require('vudash-transports')
const defaults = {
  'description': 'Visitor Count',
  'data-source': {
    source: 'random'
  }
}

class StatisticWidget {

  register (options) {
    const config = Object.assign({}, defaults, options)

    return {
      config: { description: config.description },
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      clientJs: 'client.js',
      schedule: config.schedule,

      job: (emit) => {
        const transport = Transport.configure(config['data-source'])
        transport.fetch()
        .then((value) => {
          if (Array.isArray(value)) {
            throw new Error('This widget only handles single return values from its data source.')
          }
          emit({ value })
        })
        .catch((e) => {
          emit({ value: '!', error: e.message })
        })
      }
    }
  }

}

module.exports = StatisticWidget
