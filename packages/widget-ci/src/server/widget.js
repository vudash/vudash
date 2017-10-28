const Joi = require('joi')
const Hoek = require('hoek')
const engineFactory = require('../engines/factory')

class CiWidget {

  get validation () {
    return {
      repo: Joi.string().required().description('Repository Name'),
      user: Joi.string().required().description('Account/Organisation Name'),
      branch: Joi.string().optional().description('Branch name'),
      provider: Joi.string().required().only(engineFactory.availableEngines).description('CI Provider name'),
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
  }

  register (options, emit) {
    Joi.validate(options, this.validation, (err) => {
      if (err) { throw err }
    })

    const config = Object.assign({ branch: 'master' }, options)
    const Provider = engineFactory.getEngine(config.provider)
    const provider = new Provider(config)

    return {
      config,

      job: () => {
        return provider.fetchBuildStatus()
        .then((status) => {
          const sound = Hoek.reach(config, `sounds.${status}`)
          if (sound && this.previousState !== status) {
            emit('audio:play', { data: sound })
          }

          this.previousState = status
          return { status }
        })
      }
    }
  }

}

module.exports = CiWidget
