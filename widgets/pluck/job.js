'use strict'

const request = require('request')
const Hoek = require('hoek')

let config = {
  url: 'http://api.fixer.io/latest',
  path: 'rates.CHF',
  description: 'EUR -> CHF',
  schedule: 60000
}

let schedule = config.schedule

let script = (emit) => {
  request({url: config.url, json: true}, (err, response, body) => {
    if (err) { console.error(err) }
    const value = Hoek.reach(body, config.path)
    const description = config.description
    emit({value, description})
  })
}

module.exports = {config, script, schedule}
