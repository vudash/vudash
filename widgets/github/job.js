'use strict'

const request = require('request')
const moment = require('moment')

const mappings = {
  good: 'green play',
  minor: 'yellow pause',
  major: 'red stop'
}

module.exports = {
  register: (config) => {
    return function (emit) {
      request({url: 'https://status.github.com/api/status.json', json: true}, (err, response, body) => {
        const updated = moment().fromNow()
        let icon = err ? 'red mute' : mappings[body.status]
        emit({icon, updated})
      })
    }
  },
  schedule: 1000
}
