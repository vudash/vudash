'use strict'

const engineFactory = require('../engines/factory')
const Joi = require('joi')

module.exports = {
  repo: Joi.string().required().description('Repository Name'),
  user: Joi.string().required().description('Account/Organisation Name'),
  branch: Joi.string().optional().description('Branch name'),
  schedule: Joi.number().optional().default(60000).description('Update frequency (ms)'),
  provider: Joi.string().required().only(engineFactory.availableEngines).description('CI Provider name'),
  hideOwner: Joi.boolean().optional().default(false).description('Hide repo owner from display'),
  sounds: Joi.object({
    passed: Joi.string().optional().description('Sound to play on build pass'),
    failed: Joi.string().optional().description('Sound to play on build fail'),
    unknown: Joi.string().optional().description('Sound to play on unknown state')
  }).optional().description('Sounds to play when build status changes'),
  options: Joi.when('provider', {
    is: 'circleci',
    then: Joi.object({
      auth: Joi.string().required().description('CircleCI auth token')
    }).required(),
    otherwise: Joi.forbidden()
  })
}
