'use strict'

const Provider = require('.')
const HealthStatus = require('../../health-status')
const nock = require('nock')
const { assign } = Object
const Joi = require('joi')
const { expect } = require('code')

describe('providers.statuspageio', () => {
  context('#configValidation', () => {
    it('Requires component list', () => {
      Joi.validate({ url: 'http://www.example.com' }, Provider.configValidation, (err) => {
        expect(err).to.exist()
        
      })
    })

    it('Requires statuspage url', () => {
      Joi.validate({ components: [] }, Provider.configValidation, (err) => {
        expect(err).to.exist()
        
      })
    })

    it('Statuspage url must be an url', () => {
      Joi.validate({ url: 'xxx', components: [] }, Provider.configValidation, (err) => {
        expect(err).to.exist()
        
      })
    })
  })

  context('#fetch()', () => {
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

    it('Has status page name', () => {
      expect(results.description).to.equal('Some Page')
      
    })

    it('Fetches components', () => {
      expect(results.components).to.equal([
        assign({ name: 'Component A' }, HealthStatus.HEALTHY),
        assign({ name: 'Component B' }, HealthStatus.MAJOR_OUTAGE),
        assign({ name: 'Component C' }, HealthStatus.PARTIAL_OUTAGE),
        assign({ name: 'Component D' }, HealthStatus.DEGRADED),
        assign({ name: 'Component E' }, HealthStatus.UNKNOWN)
      ])
      
    })
  })
})
