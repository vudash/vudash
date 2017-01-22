'use strict'

const got = require('got')
const HealthStatus = require('../../health-status')
const { reach } = require('hoek')

class Github {

  static get configValidation () {
    return {}
  }

  mapHealth (body) {
    const mappings = {
      good: HealthStatus.HEALTHY,
      major: HealthStatus.MAJOR_OUTAGE,
      minor: HealthStatus.PARTIAL_OUTAGE
    }

    const status = reach(body, 'status')
    return mappings[status] || HealthStatus.UNKNOWN
  }

  fetch () {
    return got('https://status.github.com/api/status.json', {
      json: true
    })
    .then((response) => {
      const body = response.body
      return {
        overallHealth: this.mapHealth(body),
        description: 'Github'
      }
    })
  }
}

module.exports = Github
