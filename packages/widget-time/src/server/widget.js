'use strict'

const { time } = require('../time')
const { parseOptions } = require('./validator')
const { parseAlarms } = require('./alarms')

class TimeWidget {
  constructor (options, emitter) {
    this.emitter = emitter
    const { error, value } = parseOptions(options)
    if (error) {
      throw new Error(error)
    }

    this.config = value
    this.alarms = parseAlarms(this.config, this.emitter)

    this.timer = setInterval(function () {
      this.run()
    }.bind(this), 1000)
    this.run()
  }

  run () {
    const data = time(this.config.timezone)
    this.emitter.emit('update', data)
  }
}

exports.register = function (options, emitter) {
  return new TimeWidget(options, emitter)
}
