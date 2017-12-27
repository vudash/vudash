'use strict'

const { load } = require('.')
const { expect } = require('code')
const { stub } = require('sinon')
const Widget = require('../widget')
const widgetDatasourceBinding = require('../widget-datasource-binding')
const EventEmitter = require('events')
const transformLoader = require('../transform-loader')

describe('widget-binder', () => {
  context('no widgets specified', () => {
    it('has empty widget list', () => {
      const widgets = load({}, [], {})
      expect(widgets).to.equal({})
    })
  })

  context('widget specified without datasource', () => {
    let result
    let stubWidget

    beforeEach(() => {
      const widgets = [{}]
      stubWidget = { register: stub() }
      stub(Widget, 'create').returns(stubWidget)
      stub(widgetDatasourceBinding, 'bindEvent')
      result = load({}, widgets, {})
    })

    afterEach(() => {
      widgetDatasourceBinding.bindEvent.restore()
      Widget.create.restore()
    })

    it('returns a list of initialised widgets', () => {
      const widgetIds = Object.keys(result)
      expect(widgetIds).to.have.length(1)
    })

    it('widget is registered', () => {
      expect(stubWidget.register.callCount).to.equal(1)
    })

    it('loopback datasource is wired up', () => {
      expect(stubWidget.register.firstCall.args[0]).to.be.an.instanceof(EventEmitter)
    })
  })

  context('widget and datasource specified', () => {
    const datasources = { xyz: { emitter: new EventEmitter() } }
    let stubWidget

    beforeEach(() => {
      const widgets = [{ datasource: 'xyz' }]
      stubWidget = { register: stub() }
      stub(Widget, 'create').returns(stubWidget)
      stub(widgetDatasourceBinding, 'bindEvent')
      load({}, widgets, datasources)
    })

    afterEach(() => {
      widgetDatasourceBinding.bindEvent.restore()
      Widget.create.restore()
    })

    it('widget is registered', () => {
      expect(stubWidget.register.callCount).to.equal(1)
    })

    it('datasource is wired up', () => {
      expect(stubWidget.register.firstCall.args[0]).to.equal(datasources.xyz.emitter)
    })
  })

  context('loads transformations from configuration', () => {
    let stubWidget

    beforeEach(() => {
      const widgets = [{ transformations: [] }]
      stubWidget = { register: stub() }
      stub(Widget, 'create').returns(stubWidget)
      stub(transformLoader, 'load').returns([])
      stub(widgetDatasourceBinding, 'bindEvent')
      load({}, widgets, {})
    })

    afterEach(() => {
      transformLoader.load.restore()
      widgetDatasourceBinding.bindEvent.restore()
      Widget.create.restore()
    })

    it('widget is registered', () => {
      expect(stubWidget.register.callCount).to.equal(1)
    })

    it('transformations are loaded', () => {
      expect(transformLoader.load.callCount).to.equal(1)
    })
  })

  context('plugin event fired', () => {
    const dashboard = { emit: null }

    beforeEach(() => {
      const widgets = [{ datasource: 'xyz' }]
      const datasources = { xyz: { emitter: new EventEmitter() } }
      stub(Widget, 'create').returns({ register: stub() })
      dashboard.emit = stub()
      load(dashboard, widgets, datasources)
      datasources.xyz.emitter.emit('plugin', 'xyzzy', 'abcde')
    })

    afterEach(() => {
      Widget.create.restore()
    })

    it('plugin event from widget causes dashboard emit', () => {
      expect(dashboard.emit.callCount).to.equal(1)
    })

    it('dashboard plugin event has correct name', () => {
      expect(dashboard.emit.firstCall.args[0]).to.equal('xyzzy')
    })

    it('dashboard plugin event has correct data', () => {
      expect(dashboard.emit.firstCall.args[1]).to.equal('abcde')
    })
  })
})
