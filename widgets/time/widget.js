'use strict'

const moment = require('moment')
const defaults = {}

class TimeWidget {

  register (options) {

    const config = Object.assign({}, defaults, options)

    return {

      markup: 'markup.html',
      update: 'update.js',
      schedule: 1000,

      job: (emit) => {
        const now = moment()
        emit({time: now.format('HH:mm:ss'), date: now.format('MMMM Do YYYY')})
      }

    }

  }

}

module.exports = TimeWidget
