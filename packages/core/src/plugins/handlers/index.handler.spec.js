'use strict'

const handler = require('./index.handler')

describe('plugins/dashboard/handlers/index.handler', () => {
  context('Default Dashboard', () => {
    before((done) => {
      process.env.DEFAULT_DASHBOARD = 'xxyyzz'
      done()
    })

    after((done) => {
      process.env.DEFAULT_DASHBOARD = undefined
      done()
    })

    it('Index points to default dashboard', (done) => {
      const replyFunc = {
        redirect: (uri) => {
          expect(uri).to.equal('/xxyyzz.dashboard')
          done()
        }
      }

      handler({}, replyFunc)
    })
  })
})
