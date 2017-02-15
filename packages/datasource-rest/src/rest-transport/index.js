const request = require('request-promise')
const { reach } = require('hoek')
const pkg = require('../../package.json')
const Joi = require('joi')

const internals = {
  prepareRequest (config) {
    const options = {
      method: config.method,
      url: config.url,
      json: true,
      headers: {
        'user-agent': `vudash/${pkg.version} (https://github.com/vudash/vudash)`
      }
    }

    if (config.body) {
      options.body = config.body
    }

    if (config.query) {
      options.qs = config.query
    }

    return options
  }
}

class RestTransport {

  constructor (options) {
    this.config = options.config
  }

  fetch () {
    const options = internals.prepareRequest(this.config)
    return request(options)
    .then((response) => {
      return reach(response, this.config.graph)
    })
  }

  get widgetValidation () {
    return Joi.object({
      url: Joi.string().description('Url to call'),
      method: Joi.string().only('get', 'post', 'put', 'options', 'delete', 'head').description('Http Method'),
      payload: Joi.object().optional().description('request payload'),
      query: Joi.object().optional().description('query params'),
      graph: Joi.string().optional().description('Graph expression (json path) to reach json values')
    })
  }
}

module.exports = RestTransport
