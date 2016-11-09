const Promise = require('bluebird').Promise
const moment = require('moment')
const Joi = require('joi')
const Hoek = require('hoek')
const CronJob = require('cron').CronJob

class TimeWidget {

  parseOptions (options) {
    const action = Joi.object({
      action: Joi.string().only('sound').description('Action name'),
      options: Joi.object({
        data: Joi.string().description('Data uri for sound file')
      }).description('Action configuration')
    }).description('Action')

    const alarm = Joi.object({
      expression: Joi.string().description('Cron Expression'),
      actions: Joi.array().items(action).description('Actions')
    }).required().description('Alarm entry')

    const schema = Joi.object({
      alarms: Joi.array().items(alarm)
    }).optional().description('List of alarms')

    return Joi.validate(options, schema)
  }

  register (options, emit) {
    const validated = this.parseOptions(options)
    if (validated.error) { throw new Error(validated.error) }
    const config = validated.value

    const alarms = Hoek.reach(config, 'alarms', { default: [] })

    alarms.forEach((alarm) => {
      alarm.actions.forEach((action) => {
        const context = { options: action.options, emit }

        new CronJob({
          cronTime: alarm.expression,
          onTick: function () {
            this.emit('audio:play', { data: this.options.data })
          },
          context,
          start: true
        })
      })
    })

    return {
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      schedule: 1000,

      job: () => {
        const now = moment()
        return Promise.resolve({time: now.format('HH:mm:ss'), date: now.format('MMMM Do YYYY')})
      }

    }
  }

}

module.exports = TimeWidget
