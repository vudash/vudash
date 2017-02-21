'use strict'

const nock = require('nock')
const RestTransport = require('.')
const request = require('request-promise')

describe('transports.rest', () => {
  const host = 'http://example.net'
  const scenarios = [
    { method: 'get', host, path: '/' },
    { method: 'post', host, path: '/some/path' },
    { method: 'post', host, path: '/some/path', payload: {a: 'b', one: 2, true: false} },
    { method: 'get', host, path: '/lala', query: { foot: 'bart' } },
    { method: 'post', host, path: '/some/path', payload: {a: 'b', one: 2, true: false}, query: { foot: 'bath' } }
  ]

  afterEach((done) => {
    nock.cleanAll()
    done()
  })

  scenarios.forEach((scenario) => {
    it(`#fetch() with ${scenario.method} ${scenario.host}`, () => {
      const config = Object.assign({}, scenario)
      config.url = `${config.host}${config.path}`
      delete config.host
      delete config.path
      const transport = new RestTransport(config)

      nock(scenario.host)[scenario.method](scenario.path, scenario.body)
      .query(scenario.query)
      .reply(200, { a: 'b' })

      return transport
        .fetch()
        .then((body) => {
          expect(nock.isDone(), nock.pendingMocks()).to.equal(true)
          expect(body.a).to.equal('b')
        })
    })
  })

  describe('Extract values', () => {
    const body = { i: { love: { animals: 'dogs' } } }

    before((done) => {
      sinon.stub(request, 'get')
      done()
    })

    after((done) => {
      request.get.restore()
      done()
    })

    it('Without graph specified, returns full object', () => {
      const transport = new RestTransport({ method: 'get', url: 'http://example.com' })
      request.get.resolves({ body })
      return transport.fetch()
      .then((value) => {
        expect(value).to.equal(body)
      })
    })

    it('extracts a specified value from JSON', () => {
      const transport = new RestTransport({ method: 'get', url: 'http://example.com', graph: 'i.love.animals' })
      request.get.resolves({ body })
      return transport.fetch()
      .then((value) => {
        expect(value).to.equal('dogs')
      })
    })

    it('Simply returns undefined for unreachable value', () => {
      const transport = new RestTransport({ method: 'get', url: 'http://example.com', graph: 'i.love.people' })
      request.get.resolves({ body })
      return transport.fetch()
      .then((value) => {
        expect(value).to.equal(undefined)
      })
    })
  })
})

