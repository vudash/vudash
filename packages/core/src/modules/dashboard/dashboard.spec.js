'use strict'

const Emitter = require('./emitter')
const widgetBinder = require('../widget-binder')
const renderer = require('./renderer')
const datasourceLoader = require('../datasource-loader')
const parser = require('./parser')
const configValidator = require('../config-validator')
const { stub, useFakeTimers } = require('sinon')
const { expect } = require('code')
const { create } = require('.')

describe('dashboard', () => {
  describe('constructor', () => {
    let dashboard
    const descriptor = { name: 'bar', layout: { columns: 4, rows: 6 } }

    beforeEach(() => {
      stub(parser, 'parse').returns(descriptor)
      stub(configValidator, 'validate').returns(descriptor)
      dashboard = create({}, {
        on: stub()
      })
    })

    afterEach(() => {
      parser.parse.restore()
      configValidator.validate.restore()
    })

    it('generates a dashboard id', () => {
      expect(dashboard.id).to.exist()
    })

    it('assigns dashboard name', () => {
      expect(dashboard.name).to.equal(descriptor.name)
    })

    it('assigns dashboard layout', () => {
      expect(dashboard.layout).to.equal(descriptor.layout)
    })

    it('assigns descriptor for future use', () => {
      expect(dashboard.descriptor).to.equal(descriptor)
    })

    it('creates emitter', () => {
      expect(dashboard.emitter).to.be.an.instanceOf(Emitter)
    })
  })

  describe('#loadDatasources()', () => {
    let dashboard

    const emitter = { on: stub() }

    beforeEach(() => {
      stub(parser, 'parse')
      stub(configValidator, 'validate')
    })

    afterEach(() => {
      parser.parse.restore()
      configValidator.validate.restore()
    })

    context('empty datasource stanza', () => {
      it('empty datasources when none are specified', () => {
        parser.parse.returns({})
        configValidator.validate.returns({})
        dashboard = create({}, emitter)
        dashboard.loadDatasources()
        expect(dashboard.datasources).to.equal({})
      })
    })

    context('list of datasources', () => {
      beforeEach(() => {
        const descriptor = {
          datasources: {
            foo: { foo: 'bar' }
          }
        }
        parser.parse.returns(descriptor)
        configValidator.validate.returns(descriptor)
        stub(datasourceLoader, 'load').returns('bar')

        dashboard = create({}, emitter)
        dashboard.loadDatasources()
      })

      afterEach(() => {
        datasourceLoader.load.restore()
      })

      it('calls loader to load datasources', () => {
        expect(datasourceLoader.load.callCount).to.equal(1)
      })

      it('calls loader to load datasources', () => {
        expect(dashboard.datasources).to.equal('bar')
      })
    })
  })

  describe('#loadWidgets()', () => {
    let dashboard

    const emitter = { on: stub() }

    beforeEach(() => {
      stub(parser, 'parse')
      stub(configValidator, 'validate')
    })

    afterEach(() => {
      parser.parse.restore()
      configValidator.validate.restore()
    })

    context('empty widget stanza', () => {
      it('empty widgets when none are specified', () => {
        parser.parse.returns({})
        configValidator.validate.returns({})
        dashboard = create({}, emitter)
        dashboard.loadWidgets()
        expect(dashboard.widgets).to.equal({})
      })
    })

    context('list of widgets', () => {
      beforeEach(() => {
        const descriptor = {
          widgets: [
            { foo: 'bar' }
          ]
        }
        parser.parse.returns(descriptor)
        configValidator.validate.returns(descriptor)
        stub(widgetBinder, 'load').returns('bar')

        dashboard = create({}, emitter)
        dashboard.loadWidgets()
      })

      afterEach(() => {
        widgetBinder.load.restore()
      })

      it('calls loader to load widgets', () => {
        expect(widgetBinder.load.callCount).to.equal(1)
      })

      it('calls loader to load widgets', () => {
        expect(dashboard.widgets).to.equal('bar')
      })
    })
  })

  describe('#destroy()', () => {
    let dashboard
    let clock

    beforeEach(() => {
      clock = useFakeTimers()
      stub(parser, 'parse').returns({})
      stub(configValidator, 'validate').returns({})
      dashboard = create({}, {
        on: stub()
      })
    })

    afterEach(() => {
      parser.parse.restore()
      configValidator.validate.restore()
      clock.restore()
    })

    context('with list of datasources', () => {
      let stub1 = stub()
      let stub2 = stub()

      beforeEach(() => {
        const timer1 = setInterval(stub1, 1)
        const timer2 = setInterval(stub2, 1)
        dashboard.datasources = {
          foo: { timer: timer1 },
          bar: { timer: timer2 }
        }
        dashboard.widgets = {}
        clock.tick(1)
      })

      it('clears all timers', () => {
        dashboard.destroy()
        clock.tick(1)
        expect(stub1.callCount).to.equal(1)
        expect(stub1.callCount).to.equal(1)
      })
    })

    context('when no datasources exist', () => {
      it('succeeds silently', () => {
        dashboard.datasources = {}
        dashboard.widgets = {}
        expect(() => {
          dashboard.destroy()
        }).not.to.throw()
      })
    })

    context('with list of widgets', () => {
      const widgets = {
        abc: { destroy: stub() },
        def: { }
      }

      beforeEach(() => {
        dashboard.widgets = widgets
        dashboard.datasources = {}
      })

      it('calls destroy on widgets which support it', () => {
        dashboard.destroy()
        expect(widgets.abc.destroy.callCount).to.equal(1)
      })
    })

    context('when no widgets exist', () => {
      it('succeeds silently', () => {
        dashboard.datasources = {}
        dashboard.widgets = {}
        expect(() => {
          dashboard.destroy()
        }).not.to.throw()
      })
    })
  })

  describe('#toRenderModel()', () => {
    context('no additiona css', () => {
      let dashboard

      const descriptor = {
        name: 'some-name',
        layout: 'some-layout'
      }

      beforeEach(() => {
        stub(parser, 'parse').returns(descriptor)
        stub(configValidator, 'validate').returns(descriptor)
        stub(renderer, 'buildRenderModel').returns({})
        dashboard = create({}, {
          on: stub()
        })
        dashboard.widgets = { abc: { foo: 'bar' } }
        dashboard.toRenderModel()
      })

      afterEach(() => {
        parser.parse.restore()
        configValidator.validate.restore()
        renderer.buildRenderModel.restore()
      })

      it('calls renderer with name', () => {
        expect(renderer.buildRenderModel.firstCall.args[0]).to.equal(dashboard.name)
      })

      it('calls renderer with widgets', () => {
        expect(renderer.buildRenderModel.firstCall.args[1]).to.equal(dashboard.widgets)
      })

      it('calls renderer with layout', () => {
        expect(renderer.buildRenderModel.firstCall.args[2]).to.equal(dashboard.layout)
      })
    })

    context('additional css', () => {
      let dashboard
      let renderModel

      const descriptor = {
        name: 'some-name',
        layout: 'some-layout'
      }

      beforeEach(async () => {
        stub(parser, 'parse').returns(descriptor)
        stub(configValidator, 'validate').returns({})
        stub(renderer, 'buildRenderModel').returns({})
        stub(renderer, 'compileAdditionalCss').returns('some: css')
        dashboard = create({}, {
          on: stub()
        })
        dashboard.additionalCss = { some: 'css' }
        dashboard.widgets = {}
        renderModel = await dashboard.toRenderModel()
      })

      afterEach(() => {
        renderer.compileAdditionalCss.restore()
        parser.parse.restore()
        configValidator.validate.restore()
        renderer.buildRenderModel.restore()
      })

      it('calls css transpiler', () => {
        expect(renderer.compileAdditionalCss.callCount).to.equal(1)
      })

      it('css is compiled', () => {
        expect(renderer.compileAdditionalCss.firstCall.args[0]).to.equal({ some: 'css' })
      })

      it('dashboard css contains additional css', () => {
        expect(renderModel.css).to.equal('some: css')
      })
    })
  })

  describe('#emit()', () => {
    const exampleEvent = { some: 'data' }
    let dashboard

    const socketEmitter = {
      on: stub()
    }

    const dashboardEmitter = {
      emit: stub()
    }

    beforeEach(() => {
      stub(parser, 'parse').returns({})
      stub(configValidator, 'validate').returns({})
      dashboard = create({}, socketEmitter)
      dashboard.emitter = dashboardEmitter
      dashboard.widgets = {
        xyz: {
          history: {
            insert: stub(),
            fetch: stub().returns([{ foo: 'bar' }])
          }
        }
      }
    })

    afterEach(() => {
      parser.parse.restore()
      configValidator.validate.restore()
      dashboardEmitter.emit.reset()
    })

    context('a widget event', () => {
      it('emits event', () => {
        dashboard.emit('xyz:update', exampleEvent)
        expect(dashboardEmitter.emit.callCount).to.equal(1)
      })

      it('calls widget event history', () => {
        dashboard.emit('xyz:update', exampleEvent)
        expect(dashboard.widgets.xyz.history.insert.callCount).to.equal(1)
      })

      it('returns existing history', () => {
        dashboard.emit('xyz:update', exampleEvent)
        expect(
          dashboardEmitter.emit.firstCall.args[1].history
        ).to.exist()
        .and.to.equal([{ foo: 'bar' }])
      })

      it('widget does not exist', () => {
        expect(() => {
          dashboard.emit('abc:update', exampleEvent)
        }).not.to.throw()
      })

      it('stores non-historical event', () => {
        dashboard.emit('xyz:update', exampleEvent)
        expect(
          dashboard.widgets.xyz.history.insert.firstCall.args[0]
        ).to.equal(exampleEvent)
      })

      it('does not store non-historical event', () => {
        dashboard.emit('xyz:update', exampleEvent, true)
        expect(dashboard.widgets.xyz.history.insert.callCount).to.equal(0)
      })
    })

    context('a non widget event', () => {
      it('emits event', () => {
        dashboard.emit('xyz:abc', exampleEvent)
        expect(dashboardEmitter.emit.callCount).to.equal(1)
      })

      it('does not add event to history', () => {
        dashboard.emit('xyz:update', exampleEvent, true)
        expect(
          dashboard.widgets.xyz.history.insert.callCount
        ).to.equal(0)
      })
    })
  })
})
