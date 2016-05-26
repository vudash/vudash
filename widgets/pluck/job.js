'use strict'

const request = require('request')
const Hoek = require('hoek')

const job = {
  schedule: 60000,
  register: function (config) {
    return (emit) => {
      request({url: config.url, json: true}, (err, response, body) => {
        if (err) { console.error(err) }
        const value = Hoek.reach(body, config.path)
        const description = config.description
        emit({value, description})
      })
    }
  }
}

module.exports = job
