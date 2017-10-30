'use strict'

const moment = require('moment-timezone')

exports.time = locale => {
  const now = moment().tz(locale)
  return {
    time: now.format('HH:mm:ss'),
    date: now.format('MMMM Do YYYY')
  }
}
