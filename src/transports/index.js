const Joi = require('joi')

class Transport {

  constructor (descriptor) {
    this.config = descriptor.config
    this.configValidation.validate(this.config, (err) => {
      if (err) { throw err }
    })
  }

  get configValidation () {
    return Joi.object({})
  }

  fetch () {
    throw new Error('Transport does not implement fetch')
  }

}

module.exports = Transport
