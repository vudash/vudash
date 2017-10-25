'use strict'

const server = require('app')

describe('plugins.dashboard', () => {
  const dashboard = 'simple'

  it('Loads dashboards into memory', () => {
    return server.inject({ url: `/${dashboard}.dashboard` })
    .then(reply => {
      expect(reply.statusCode).to.equal(200)
    })
  })
})
