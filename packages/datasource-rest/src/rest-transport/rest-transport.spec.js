'use strict'

const nock = require('nock')
const RestTransport = require('.')
const { expect } = require('code')

describe('transports.rest', () => {
  const host = 'http://example.net'
  const scenarios = [
    { method: 'get', host, path: '/' },
    { method: 'post', host, path: '/some/path' },
    { method: 'post', host, path: '/some/path', payload: {a: 'b', one: 2, true: false} },
    { method: 'get', host, path: '/lala', query: { foot: 'bart' } },
    { method: 'post', host, path: '/some/path', payload: {a: 'b', one: 2, true: false}, query: { foot: 'bath' } }
  ]

  afterEach(() => {
    nock.cleanAll()
  })

  scenarios.forEach(scenario => {
    it(`#fetch() with ${scenario.method} ${scenario.host}`, async () => {
      const config = Object.assign({}, scenario)
      config.url = `${config.host}${config.path}`
      delete config.host
      delete config.path
      const transport = new RestTransport(config)

      nock(scenario.host)[scenario.method](scenario.path, scenario.body)
        .query(scenario.query)
        .reply(200, { a: 'b' })

      const body = await transport.fetch()
      expect(nock.isDone(), nock.pendingMocks()).to.equal(true)
      expect(body.a).to.equal('b')
    })
  })

  context('Json body', () => {
    const body = { i: { love: { animals: 'dogs' } } }
    const options = { method: 'get', url: 'http://example.com/some/stuff' }

    beforeEach(() => {
      nock('http://example.com')
        .get('/some/stuff')
        .reply(200, body)
    })

    afterEach(() => {
      nock.cleanAll()
    })

    it('returns full body', async () => {
      const transport = new RestTransport(options)
      const value = await transport.fetch()
      expect(value).to.equal(body)
    })
  })
})
