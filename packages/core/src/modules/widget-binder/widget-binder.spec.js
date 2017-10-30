'use strict'

const { load } = require('.')
const { expect } = require('code')
const { stub } = require('sinon')
const Widget = require('../widget')

describe('widget-binder', () => {
  context('no widgets specified', () => {
    it('has empty widget list', () => {
      const widgets = load({}, [], {})
      expect(widgets).to.equal([])
    })
  })

  context('event emitter', () => {
    const dashboard = { emitter: { on: 'xxx' } }
    const widgets = [{ datasource: 'xyz' }]
    const datasources = { 'xyz': { emitter: { on: stub() } } }
    const registerStub = stub()

    beforeEach(() => {
      stub(Widget, 'create').returns({ register: registerStub })
    })

    afterEach(() => {
      Widget.create.restore()
    })

    it('binds dashboard emitter', () => {
      load(dashboard, widgets, datasources)
      expect(registerStub.firstCall.args[0]).to.equal(dashboard.emitter)
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
