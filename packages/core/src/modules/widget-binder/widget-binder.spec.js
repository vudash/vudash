'use strict'

const { load } = require('.')
const { expect } = require('code')
const { stub } = require('sinon')
const Widget = require('../widget')
const EventEmitter = require('events')

describe('widget-binder', () => {
  context('no widgets specified', () => {
    it('has empty widget list', () => {
      const widgets = load({}, [], {})
      expect(widgets).to.equal({})
    })
  })

  context('event emitter', () => {
    const registerStub = stub()

    const widget = {
      id: 'zzz',
      register: registerStub,
      update: stub().returns('xxx')
    }

    beforeEach(() => {
      stub(Widget, 'create').returns(widget)
    })

    afterEach(() => {
      Widget.create.restore()
    })

    context('datasource provides emitter', () => {
      const dashboard = { emit: stub() }
      let emitter

      beforeEach(() => {
        emitter = new EventEmitter()
        const widgets = [{ datasource: 'xyz' }]
        load(dashboard, widgets, { 'xyz': { emitter } })
      })

      afterEach(() => {
        widget.update.reset()
        dashboard.emit.reset()
      })

      it('binds dashboard emitter', () => {
        emitter.emit('update', 'aaa')
        expect(dashboard.emit.callCount).to.equal(1)
      })

      it('dashboard emitter calls update on widget', () => {
        emitter.emit('update', 'bbb')
        expect(widget.update.callCount).to.equal(1)
      })

      it('dashboard emitter passes new data to widget', () => {
        widget.update.returns('yyy')
        emitter.emit('update', 'ccc')
        expect(widget.update.firstCall.args[0]).to.equal('ccc')
      })

      it('dashboard emitter includes metadata', () => {
        emitter.emit('update', 'ddd')
        expect(dashboard.emit.firstCall.args[1].meta).to.exist()
      })

      it('metadata contains updated date', () => {
        emitter.emit('update', 'eee')
        expect(
          dashboard.emit.firstCall.args[1].meta.updated
        ).to.exist().and.to.be.a.date()
      })
    })

    context('non-emitting datasource', () => {
      const dashboard = { emitter: new EventEmitter() }

      beforeEach(() => {
        registerStub.reset()
      })

      it('widget does not declare a datasource', () => {
        const widgets = [{ datasource: 'xyz' }]
        load(dashboard, widgets, { 'xyz': {} })
        expect(registerStub.callCount).to.equal(1)
      })

      it('datasource cannot be found', () => {
        const widgets = [{ datasource: 'abc' }]
        load(dashboard, widgets, {})
        expect(registerStub.callCount).to.equal(1)
      })

      it('datasource does not have an emitter', () => {
        const widgets = [{ datasource: 'xyz' }]
        load(dashboard, widgets, { 'xyz': {} })
        expect(registerStub.callCount).to.equal(1)
      })
    })
  })

  describe('widget registration', () => {

  })

  describe('inward event binding', () => {

  })

  describe('widget serverside update', () => {

  })

  describe('outward event binding', () => {

  })

  context('datasource does not exist', () => {

  })


  context.skip('widgets', () => {
    it('calls register on each widget', () => {

    })
  })
})
