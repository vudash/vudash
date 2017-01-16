'use strict'

const got = require('got')
const HealthStatus = require('../../health-status')
const { reach } = require('hoek')

function transformOverallHealth (source) {
  const mappings = {
    none: HealthStatus.HEALTHY,
    minor: HealthStatus.PARTIAL_OUTAGE,
    major: HealthStatus.MAJOR_OUTAGE
  }
  const overallHealth = reach(source, 'status.indicator')

  return overallHealth === mappings[overallHealth] || HealthStatus.UNKNOWN
}

function mapHealthStatus (status) {
  const mappings = {
    'operational': HealthStatus.HEALTHY,
    'partial_outage': HealthStatus.PARTIAL_OUTAGE,
    'major_outage': HealthStatus.MAJOR_OUTAGE,
    'degraded_performance': HealthStatus.DEGRADED
  }
  return mappings[status] || HealthStatus.UNKNOWN
}

class StatuspageIo {
  constructor (config) {
    this.url = config.url
    this.selectedComponents = config.components
  }

  filterComponentList (all, component) {
    if (this.selectedComponents.includes(component.name)) {
      all[component.name] = mapHealthStatus(component.status)
    }
    return all
  }

  fetch () {
    return got(this.url, {
      json: true
    })
    .then((response) => {
      const body = response.body
      const filteredComponents = body.components.reduce(this.filterComponentList.bind(this), {})

      return {
        description: reach(body, 'page.name'),
        health: filteredComponents,
        overallHealth: transformOverallHealth(body)
      }
    })
  }
}

module.exports = StatuspageIo
