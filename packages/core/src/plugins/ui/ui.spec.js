'use strict'

const server = require('server')
const { expect } = require('code')

describe('core/plugins/ui', function () {
  this.timeout(10000)

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
    .then(({ statusCode }) => {
      expect(statusCode).to.equal(200)
    })
  })

  it('Builds dashboard cache', () => {
    const cachedDashboards = Object.keys(app.plugins.ui.dashboards)
    expect(cachedDashboards).to.only.include('simple')
  })
})
