'use strict'

const request = require('request-promise')
const { reach } = require('hoek')
const pkg = require('../../package.json')

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
    this.config = options
  }

  fetch () {
    const options = internals.prepareRequest(this.config)
    return request(options)
    .then((response) => {
      return reach(response, this.config.graph)
    })
  }
}

module.exports = RestTransport
