'use strict'

const server = require(fromRoot('app'))

describe('plugins.dashboard', () => {
  const dashboard = 'simple'

  it('Loads dashboards into memory', (done) => {
    server.inject({ url: `/${dashboard}.dashboard` }, (response) => {
      expect(Object.keys(server.plugins.dashboard.dashboards).length).to.equal(1)
      expect(server.plugins.dashboard.dashboards[dashboard]).to.exist()
      done()
    })
  })
})
