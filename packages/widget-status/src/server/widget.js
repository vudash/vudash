const request = require('request-promise')
const moment = require('moment')

class StatusWidget {

  register (options) {
    return {
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

module.exports = StatusWidget
