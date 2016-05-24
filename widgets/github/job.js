'use strict'

const request = require('request')
const moment = require('moment')

const mappings = {
  good: 'green play',
  minor: 'yellow pause',
  major: 'red stop'
}

module.exports = {
  script: function (emit) {
    request({url: 'https://status.github.com/api/status.json', json: true}, function(err, response, body) {
      const updated = moment().fromNow()
      let icon
      if (err) {
        icon = 'red mute'
      } else {
        icon = mappings[body.status]
      }
      emit({icon, updated})
    })
  },

  schedule: 1000

}
