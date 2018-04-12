'use strict'

const { time } = require('../time')
const { schema } = require('./validation')
const { parseAlarms } = require('./alarms')

class TimeWidget {
  constructor (options, emitter) {
    this.config = options
    this.emitter = emitter
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

  destroy () {
    clearInterval(this.timer)
    this.alarms.forEach(actions => {
      actions.forEach(action => action.stop())
    })
  }
}

exports.validation = schema

exports.register = function (options, emitter) {
  return new TimeWidget(options, emitter)
}
