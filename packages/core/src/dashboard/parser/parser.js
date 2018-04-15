'use strict'

const { ConfigurationError } = require('../../errors')

function get (directive) {
  if (process.env.hasOwnProperty(directive)) {
    return process.env[directive]
  }

  throw new ConfigurationError(`Environment variable ${directive} does not exist`)
}

function parse (json) {
  const root = Object.keys(json)

  root.forEach(key => {
    const child = json[key]
    if (typeof child !== 'object') { return }
    const directive = child['$env']
    if (directive) {
      json[key] = get(directive)
    } else {
      parse(json[key])
    }
  })

  return json
}

exports.parse = parse
