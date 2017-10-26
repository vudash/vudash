'use strict'

const { expect } = require('code')
const { handler } = require('.')

describe('plugins/dashboard/handlers/index.handler', () => {
  context('Default Dashboard', () => {
    before(() => {
      process.env.DEFAULT_DASHBOARD = 'xxyyzz'
    })

    after(() => {
      process.env.DEFAULT_DASHBOARD = undefined
    })

    it('Index points to default dashboard', done => {
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
