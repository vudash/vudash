const request = require('request-promise')
const moment = require('moment')

class GithubWidget {

  register (options) {
    return {
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      schedule: 60000,

      job: () => {
        return request({ url: 'https://status.github.com/api/status.json', json: true })
        .then((body) => {
          const updated = moment().fromNow()
          return { status: body.status, updated }
        })
      }

    }
  }

}

module.exports = GithubWidget
