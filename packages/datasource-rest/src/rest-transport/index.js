const request = require('request-promise')
const Hoek = require('hoek')
const pkg = require('../../package.json')

class RestTransport {

  constructor (options) {
    this.config = options.config
  }

  fetch () {
    const options = this.prepareRequest()
    return request(options)
    .then((response) => {
      return this.reach(response, this.config.graph)
    })
  }

  prepareRequest () {
    const options = {
      method: this.config.method,
      url: this.config.url,
      json: true,
      headers: {
        'user-agent': `vudash/${pkg.version} (https://github.com/vudash/vudash)`
      }
    }

    if (this.config.body) {
      options.body = this.config.body
    }

    if (this.config.query) {
      options.qs = this.config.query
    }

    return options
  }

  reach (json, graph) {
    return Hoek.reach(json, graph)
  }

}

module.exports = RestTransport
