const nock = require('nock')
const RestTransport = require('.')

describe('transports.rest', () => {
  const host = 'http://example.net'
  const scenarios = [
    { method: 'get', host, path: '/' }
  ]

  afterEach((done) => {
    nock.cleanAll()
    done()
  })

  scenarios.forEach((scenario) => {
    it('#get', () => {
      const config = Object.assign({}, scenario)
      config.url = `${config.host}${config.path}`
      delete config.host
      delete config.path
      const transport = new RestTransport({ config })

      nock(scenario.host)[scenario.method](scenario.path)
      .reply(200, { a: 'b' })

      return transport
        .fetch()
        .then((body) => {
          expect(nock.isDone(), nock.pendingMocks()).to.equal(true)
          expect(body.a).to.equal('b')
        })
    })
  })
})
