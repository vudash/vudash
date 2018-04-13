'use strict'

const { stub } = require('sinon')
const { put } = require('.')
const { expect } = require('code')

describe('core/plugins/api', () => {
  describe('v1', () => {
    describe('dashboards', () => {
      const name = 'xyz'
      const descriptor = { layout: { columns: 0, rows: 0 }, widgets: [] }
      const dashboards = {}
      const server = {
        plugins: {
          ui: {
            dashboards
          },
          socket: {
            io: {
              on: stub()
            }
          }
        }
      }

      const reply = stub()
        .returns({
          code: stub()
        })

      beforeEach(() => {
        const request = {
          server,
          params: {
            name
          },
          payload: {
            descriptor
          }
        }

        put(request, reply)
      })

      afterEach(() => {
        reply.reset()
      })

      it('reply is called', () => {
        expect(reply.callCount).to.equal(1)
      })

      it('dashboards contains new dashboard', () => {
        expect(Object.keys(dashboards)).to.include(name)
      })
    })
  })
})
