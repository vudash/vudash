'use strict'

const Promise = require('bluebird')
const moment = require('moment-timezone')

exports.time = (locale) => {
  const now = moment().tz(locale)
  return Promise.resolve({
    time: now.format('HH:mm:ss'),
    date: now.format('MMMM Do YYYY')
  })
}
