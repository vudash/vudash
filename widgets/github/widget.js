'use strict'

const request = require('request')
const moment = require('moment')

class GithubWidget {

  register (options) {
    return {
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      schedule: 60000,

      job: (emit) => {
        request({ url: 'https://status.github.com/api/status.json', json: true }, (err, response, body) => {
          const updated = moment().fromNow()
          if (err) { return emit({ status: 'error', updated }) }
          emit({status: body.status, updated})
        })
      }

    }
  }

}

module.exports = GithubWidget
