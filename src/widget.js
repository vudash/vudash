const Joi = require('joi')
const engineFactory = require('./engines/factory')

class CiWidget {

  get validation () {
    return Joi.object({
      schedule: Joi.number().optional().description('Update frequency (ms)'),
      repo: Joi.string().required().description('Repository Name'),
      user: Joi.string().required().description('Account/Organisation Name'),
      branch: Joi.string().optional().description('Branch name'),
      provider: Joi.string().required().only(engineFactory.availableEngines).description('CI Provider name'),
      options: Joi.when('provider', {
        is: 'circleci',
        then: Joi.object({
          auth: Joi.string().required().description('CircleCI auth token')
        }).required(),
        otherwise: Joi.forbidden()
      })
    })
  }

  register (options) {
    Joi.validate(options, this.validation, (err) => {
      if (err) { throw err }
    })

    const config = Object.assign({ branch: 'master' }, options)
    const Provider = engineFactory.getEngine(config.provider)
    const provider = new Provider(config)

    return {
      config,
      schedule: config.schedule || 60000,
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      clientJs: 'client.js',

      job: () => {
        return provider.fetchBuildStatus()
        .then((status) => {
          return { status }
        })
      }
    }
  }

}

module.exports = CiWidget
