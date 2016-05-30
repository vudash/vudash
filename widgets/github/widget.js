'use strict'

const request = require('request')
const moment = require('moment')

const mappings = {
  good: 'green play',
  minor: 'yellow pause',
  major: 'red stop'
}

class GithubWidget {

  register (options) {
    return {
      markup: 'markup.html',
      update: 'update.js',
      schedule: 60000,

      job: (emit) => {
        request({url: 'https://status.github.com/api/status.json', json: true}, (err, response, body) => {
          const updated = moment().fromNow()
          let icon = err ? 'red mute' : mappings[body.status]
          emit({icon, updated})
        })
      }

    }
  }

}

module.exports = GithubWidget
