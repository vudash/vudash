const Joi = require('joi')
const engineFactory = require('./engines/factory')

class CiWidget {

  get validation () {
    return Joi.object({
      schedule: Joi.number().optional().description('Update frequency (ms)'),
      repo: Joi.string().required().description('Repository Name'),
      user: Joi.string().required().description('Account/Organisation Name'),
      branch: Joi.string().optional().description('Branch name'),
      provider: Joi.string().required().only(engineFactory.availableEngines).description('CI Provider name')
    })
  }

  register (options) {
    Joi.validate(options, this.validation, (err) => {
      if (err) { throw err }
    })

    const branch = options.branch || 'master'
    const Provider = engineFactory.getEngine(options.provider)
    const provider = new Provider(options.user, options.repo, branch)

    return {
      config: options,
      schedule: options.schedule || 60000,
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
