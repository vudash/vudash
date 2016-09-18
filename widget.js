'use strict'

const moment = require('moment')

class TimeWidget {

  register (options) {
    return {

      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      schedule: 1000,

      job: (emit) => {
        const now = moment()
        emit({time: now.format('HH:mm:ss'), date: now.format('MMMM Do YYYY')})
      }

    }
  }

}

module.exports = TimeWidget
