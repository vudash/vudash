'use strict'

const { stub } = require('sinon')
const { put } = require('.')
const { expect } = require('code')

describe('core/plugins/api', () => {
  describe('v1', () => {
    describe('view/current', () => {
      const dashboard = 'xyz'
      const server = {
        plugins: {
          socket: {
            io: {
              emit: stub()
            }
          }
        }
      }

      const reply = stub()

      beforeEach(() => {
        const request = {
          server,
          payload: {
            dashboard
          }
        }

        put(request, reply)
      })

      afterEach(() => {
        server.plugins.socket.io.emit.reset()
        reply.reset()
      })

      it('reply is called', () => {
        expect(reply.callCount).to.equal(1)
      })

      it('emits a broadcast event', () => {
        expect(server.plugins.socket.io.emit.callCount).to.equal(1)
      })

      it('broadcast event has dashboard switch event', () => {
        expect(server.plugins.socket.io.emit.firstCall.args[0]).to.equal('view:current')
      })

      it('broadcast event has payload data', () => {
        expect(server.plugins.socket.io.emit.firstCall.args[1]).to.equal({ dashboard })
      })
    })
  })
})
