'use strict'

const request = require('request')
const Hoek = require('hoek')
const defaults = {
  url: "http://api.fixer.io/latest",
  path: "rates.CHF",
  description: "EUR -> CHF"
}

class PluckWidget {

  register (options) {

    const config = Object.assign({}, defaults, options)

    return {
      markup: 'markup.html',
      update: 'update.js',
      schedule: 60000,

      job: (emit) => {
        request({url: config.url, json: true}, (err, response, body) => {
          if (err) { console.error(err) }
          const value = Hoek.reach(body, config.path)
          const description = config.description
          emit({value, description})
        })
      }

    }

  }

}

module.exports = PluckWidget
