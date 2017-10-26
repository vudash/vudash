'use strict'

const server = require('server')

describe('plugins.dashboard', () => {
  let app
  const dashboard = 'simple'

  before(async () => {
    app = await server.register()
  })

  after(async () => {
    await server.stop(app)
  })

  it('Loads dashboards into memory', () => {
    return app.inject({ url: `/${dashboard}.dashboard` })
    .then(reply => {
      expect(reply.statusCode).to.equal(200)
    })
  })

  it('Builds dashboard cache', () => {
    const cachedDashboards = Object.keys(app.plugins.dashboard.dashboards)
    expect(cachedDashboards).to.only.include('simple')
  })
})
