'use strict'

const server = require(fromRoot('app'))

describe('plugins.dashboard', () => {
  const dashboard = 'simple'

  it('Loads dashboards into memory', (done) => {
    server.inject({ url: `/${dashboard}.dashboard` }, (reply) => {
      expect(reply.statusCode).to.equal(200)
      done()
    })
  })
})
