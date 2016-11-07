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
        file: Joi.string().description('Sound file to play')
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

  register (options) {
    const validated = this.parseOptions(options)
    if (validated.error) { throw new Error(validated.error) }
    const config = validated.value

    const alarms = Hoek.reach(config, alarms, { default: [] })

    alarms.forEach((alarm) => {
      new CronJob({
        cronTime: alarm.expression,
        onTick: () => {

        },
        context: alarm.options,
        start: true
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
