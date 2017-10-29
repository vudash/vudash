'use strict'

const { expect } = require('code')
const binder = require('.')
const { stub, useFakeTimers } = require('sinon')
const datasourceEmitter = require('./datasource-emitter')

describe('datasource-binder', () => {
  describe('timers', () => {
    let clock
    let timer

    const emitter = {
      emit: stub()
    }

    const datasource = {
      fetch: stub().resolves({ foo: 'bar' })
    }

    beforeEach(() => {
      stub(datasourceEmitter, 'createEmitter').returns(emitter)
      clock = useFakeTimers()
      const result = binder.bind(datasource, 500)
      timer = result.timer
    })

    afterEach(() => {
      datasourceEmitter.createEmitter.restore()
      clock.restore()
      datasource.fetch.reset()
      clearInterval(timer)
    })

    it('fetch is called immediately', () => {
      expect(datasource.fetch.callCount).to.equal(1)
    })

    it('fetch when interval is reached', () => {
      clock.tick(500)
      expect(datasource.fetch.callCount).to.equal(2)
    })

    it('on each subsequent interval', () => {
      clock.tick(1000)
      expect(datasource.fetch.callCount).to.equal(3)
    })
  })

  context('missing schedule', () => {
    let clock
    let timer

    const emitter = {
      emit: stub()
    }

    const datasource = {
      fetch: stub().resolves({ foo: 'bar' })
    }

    beforeEach(() => {
      stub(datasourceEmitter, 'createEmitter').returns(emitter)
      clock = useFakeTimers()
      const result = binder.bind(datasource)
      timer = result.timer
    })

    afterEach(() => {
      datasourceEmitter.createEmitter.restore()
      clock.restore()
      datasource.fetch.reset()
      clearInterval(timer)
    })

    it('default interval is set to 30 seconds', () => {
      clock.tick(30000)
      expect(datasource.fetch.callCount).to.equal(2)
    })
  })

  describe('event emitters', () => {
    let timer
    let emitter

    const expectedData = { foo: 'bar' }

    const datasource = {
      fetch: stub().resolves(expectedData)
    }

    beforeEach(() => {
      const result = binder.bind(datasource, 500)
      timer = result.timer
      emitter = result.emitter
    })

    afterEach(() => {
      datasource.fetch.reset()
      clearInterval(timer)
    })

    it('fetch emits data', done => {
      emitter.on('update', data => {
        expect(data).to.equal(expectedData)
        done()
      })
    })
  })
})
