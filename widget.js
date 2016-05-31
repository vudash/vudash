'use strict'

const request = require('request')
const Hoek = require('hoek')
const defaults = {
  url: 'http://api.fixer.io/latest',
  path: 'rates.CHF',
  description: 'EUR -> CHF'
}

class PluckWidget {

  register (options) {
    const config = Object.assign({}, defaults, options)

    return {
      config: { description: config.description },
      markup: 'markup.html',
      update: 'update.js',
      clientJs: 'client.js',
      schedule: 60000,

      job: (emit) => {
        request({url: config.url, json: true}, (err, response, body) => {
          if (err || response.statusCode !== 200) {
            console.error(err)
          } else {
            emit({ value: Hoek.reach(body, config.path) })
          }
        })
      }
    }
  }

}

module.exports = PluckWidget
