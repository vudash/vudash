const Transport = require('..')
const request = require('request-promise')
const Joi = require('joi')

class RestTransport extends Transport {

  get configValidation () {
    return Joi.object({
      url: Joi.string().description('Url to call'),
      method: Joi.string().only('get', 'post', 'put', 'options', 'delete', 'head').description('Http Method'),
      payload: Joi.object().optional().description('request payload'),
      query: Joi.object().optional().description('query params'),
      graph: Joi.string().description('Graph expression (json path) to reach json values')
    })
  }

  fetch () {
    const options = {
      method: this.config.method,
      url: this.config.url,
      json: true
    }

    if (this.config.body) {
      options.body = this.config.body
    }

    if (this.config.query) {
      options.query = this.config.query
    }

    return request(options)
  }

}

module.exports = RestTransport
