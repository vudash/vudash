'use strict'

const Provider = require('.')
const HealthStatus = require('../../health-status')
const nock = require('nock')
const { assign } = Object

describe('providers.statuspageio', () => {
  const url = 'http://example.org/'
  const statuspageJson = {
    page: {
      name: 'Some Page'
    },
    status: {
      indicator: 'none'
    },
    components: [
      { name: 'status', indicator: 'none' },
      { name: 'Component A', status: 'operational' },
      { name: 'Component B', status: 'major_outage' },
      { name: 'Component C', status: 'partial_outage' },
      { name: 'Component D', status: 'degraded_performance' },
      { name: 'Component E', status: 'xxx' },
      { name: 'Component F', status: 'operational' }
    ]
  }
  const config = {
    url,
    components: [
      'Component A',
      'Component B',
      'Component C',
      'Component D',
      'Component E'
    ]
  }
  let results

  beforeEach(() => {
    nock(url, {
      reqheaders: {
        accept: 'application/json'
      }
    })
    .get('/')
    .reply(200, statuspageJson)

    const provider = new Provider(config)
    return provider.fetch()
    .then((output) => {
      results = output
    })
  })

  it('Has status page name', (done) => {
    expect(results.description).to.equal('Some Page')
    done()
  })

  it('Fetches overall status', (done) => {
    expect(results.overallHealth).to.equal(HealthStatus.HEALTHY)
    done()
  })

  it('Fetches components', (done) => {
    expect(results.health['Component A']).to.equal(assign({ name: 'Component A' }, HealthStatus.HEALTHY))
    expect(results.health['Component B']).to.equal(assign({ name: 'Component B' }, HealthStatus.MAJOR_OUTAGE))
    expect(results.health['Component C']).to.equal(assign({ name: 'Component C' }, HealthStatus.PARTIAL_OUTAGE))
    expect(results.health['Component D']).to.equal(assign({ name: 'Component D' }, HealthStatus.DEGRADED))
    expect(results.health['Component E']).to.equal(assign({ name: 'Component E' }, HealthStatus.UNKNOWN))
    done()
  })
})
