'use strict'

const server = require('server')

describe('plugins.dashboard', () => {
  let app
  const dashboard = 'simple'

  before(async () => {
    app = await server.register()
  })

  after(() => {
    app.shutdown()
  })

  it('Loads dashboards into memory', () => {
    return app.inject({ url: `/${dashboard}.dashboard` })
    .then(reply => {
      expect(reply.statusCode).to.equal(200)
    })
  })
})
