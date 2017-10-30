'use strict'

const { reach } = require('hoek')
const { CronJob } = require('cron')

exports.parseAlarms = function (config, emitter) {
  const alarms = reach(config, 'alarms', { default: [] })
  return alarms.map(alarm => {
    return alarm.actions.map(action => {
      const context = {
        options: action.options,
        emitter
      }

      return new CronJob({
        cronTime: alarm.expression,
        onTick: function () {
          this.emitter.emit('plugin', 'audio:play', {
            data: this.options.data
          })
        },
        context,
        start: true,
        timeZone: config.timezone,
        runOnInit: false
      })
    })
  })
}
