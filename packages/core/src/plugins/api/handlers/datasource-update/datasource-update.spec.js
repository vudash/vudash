'use strict'

const handler = require('.')
const { stub } = require('sinon')
const { expect } = require('code')
const dashboardLoader = require('modules/dashboard/loader')

describe('api/datasource-update', () => {
  let reply

  context('datasource exists', () => {
    let datasource

    const data = { foo: 'bar' }

    const request = {
      params: {},
      payload: {
        data
      },
      server: {
        plugins: {
          ui: {
            dashboards: {}
          }
        }
      }
    }

    beforeEach(() => {
      datasource = {
        update: stub()
      }
      stub(dashboardLoader, 'find').returns({
        getDatasource: stub().returns(datasource)
      })
      reply = stub()
      handler(request, reply)
    })

    afterEach(() => {
      dashboardLoader.find.restore()
    })

    it('returns ok', () => {
      expect(reply.firstCall.args).to.equal([])
    })

    it('calls update on datasource', () => {
      expect(datasource.update.callCount).to.equal(1)
    })

    it('calls update with given data', () => {
      expect(datasource.update.firstCall.args[0]).to.equal({ data })
    })
  })

  context('datasource does not support update', () => {
    const request = {
      params: {
        board: 'abc',
        datasourceId: 'def'
      },
      payload: {},
      server: {
        plugins: {
          ui: {
            dashboards: {}
          }
        }
      }
    }

    beforeEach(() => {
      stub(dashboardLoader, 'find').returns({
        getDatasource: stub().returns({})
      })
      reply = stub()
      handler(request, reply)
    })

    afterEach(() => {
      dashboardLoader.find.restore()
    })

    it('has error response', () => {
      expect(reply.firstCall.args[0]).to.be.an.instanceOf(Error)
    })

    it('has error message', () => {
      expect(reply.firstCall.args[0].message).to.equal(
        'Datasource abc/def does not allow update via the API'
      )
    })
  })

  context('error fetching datasource', () => {
    const request = {
      params: {},
      server: {
        plugins: {
          ui: {
            dashboards: {}
          }
        }
      }
    }

    beforeEach(() => {
      reply = stub()
      stub(dashboardLoader, 'find').returns({
        getDatasource: stub().throws(new Error('aaa'))
      })
      handler(request, reply)
    })

    afterEach(() => {
      dashboardLoader.find.restore()
    })

    it('has error message', () => {
      expect(reply.firstCall.args[0]).to.be.an.instanceOf(Error)
    })
  })
})
