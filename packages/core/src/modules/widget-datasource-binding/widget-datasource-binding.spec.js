'use strict'

const widgetDatasourceBinder = require('.')
const { stub } = require('sinon')
const { expect } = require('code')
const EventEmitter = require('events')

describe('widget-datasource-binding', () => {
  context('datasource has emitter', () => {
    const widget = {}
    const dashboard = {}

    it('event is bound', () => {
      const datasource = { emitter: { on: stub() } }
      widgetDatasourceBinder.bindEvent(dashboard, widget, datasource, [])
      expect(datasource.emitter.on.callCount).to.equal(1)
    })
  })

  context('widget emits data', () => {
    const rawData = {
      user: {
        firstName: 'Alfred',
        lastName: 'Wilks'
      }
    }

    const widget = { id: 'abc', update: stub().returns(rawData) }
    const dashboard = { emit: stub() }

    before(() => {
      const emitter = new EventEmitter()
      const datasource = { emitter }

      widgetDatasourceBinder.bindEvent(dashboard, widget, datasource, [])
      dashboard.emit = stub()

      datasource.emitter.emit('update')
    })

    it('dashboard event is emitted', () => {
      expect(dashboard.emit.callCount).to.equal(1)
    })

    it('emitted event has widget id', () => {
      expect(dashboard.emit.firstCall.args[0]).to.equal('abc:update')
    })

    it('emitted event has data', () => {
      expect(dashboard.emit.firstCall.args[1].data).to.equal(rawData)
    })

    it('emitted event has metaData', () => {
      expect(dashboard.emit.firstCall.args[1].meta).to.include('updated')
    })
  })

  context('output is transformed', () => {
    const widgetOutput = {
      fullName: 'Alfred Wilks'
    }

    const transformedData = { foo: 'bar' }

    const transformers = [{
      transform: stub().returns(transformedData)
    }]

    const widget = {
      update: stub()
        .withArgs(transformedData)
        .returns(widgetOutput)
    }
    const dashboard = { emit: stub() }
    const datasource = { emitter: new EventEmitter() }

    before(() => {
      widgetDatasourceBinder.bindEvent(dashboard, widget, datasource, transformers)
      dashboard.emit = stub()

      datasource.emitter.emit('update')
    })

    it('dashboard event is emitted', () => {
      expect(dashboard.emit.callCount).to.equal(1)
    })

    it('emitted event has transformed data', () => {
      expect(
        dashboard.emit.firstCall.args[1].data
      ).to.equal(widgetOutput)
    })
  })
})
