'use strict'

const Provider = require('.')
const HealthStatus = require('../../health-status')
const nock = require('nock')

describe('providers.github', () => {
  context('#configValidation', () => {
    it('Returns an empty block', (done) => {
      expect(Provider.configValidation).to.equal()
    })
  })

  context('#fetch()', () => {
    const scenarios = [
      { status: 'good', health: HealthStatus.HEALTHY },
      { status: 'minor', health: HealthStatus.PARTIAL_OUTAGE },
      { status: 'major', health: HealthStatus.MAJOR_OUTAGE },
      { status: 'xyz', health: HealthStatus.UNKNOWN }
    ]

    afterEach((done) => {
      nock.cleanAll()
      done()
    })

    scenarios.forEach(({ status, health }) => {
      it(`Returns ${health} when status is ${status}`, () => {
        nock('https://status.github.com')
        .get('/api/status.json')
        .reply(200, { status })

        const provider = new Provider()
        return provider.fetch()
        .then((output) => {
          expect(output.description).to.equal('Github')
          expect(output.overallHealth).to.equal(health)
        })
      })
    })
  })
})
