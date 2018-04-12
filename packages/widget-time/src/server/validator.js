'use strict'

const Joi = require('joi')
const moment = require('moment')

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

exports.schema = Joi.object({
  timezone: Joi.string().only(moment.tz.names()).optional().default('UTC').description('A momentjs timezone'),
  alarms: Joi.array().items(alarm).optional().description('List of alarms')
}).optional()
