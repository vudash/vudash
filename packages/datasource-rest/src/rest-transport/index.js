'use strict'

const got = require('got')
const { reach } = require('hoek')
const pkg = require('../../package.json')

const internals = {
  prepareRequest (config) {
    const options = {
      json: true,
      headers: {
        'user-agent': `vudash/${pkg.version} (https://github.com/vudash/vudash)`,
        'content-type': 'application/json'
      }
    }

    if (config.body) {
      options.body = JSON.stringify(config.body)
    }

    if (config.query) {
      options.query = config.query
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
    return got[this.config.method](this.config.url, options)
    .then(({ body }) => {
      return reach(body, this.config.graph)
    })
  }
}

module.exports = RestTransport
