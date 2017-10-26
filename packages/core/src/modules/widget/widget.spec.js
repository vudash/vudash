'use strict'

const Widget = require('modules/widget')
const { stub } = require('sinon')
const loader = require('./loader')
const datasource = require('../datasource')
const { expect } = require('code')

describe('widget', () => {
  const position = { x: 0, y: 0, w: 1, h: 1 }
  const renderOptions = { position }

  context('Datasources', () => {
    const dashboard = {
      layout: { rows: 4, columns: 5 },
      emitter: { emit: stub() },
      datasources: {
        'xxx': {
          constructor: () => {},
          options: { foo: 'bar' }
        }
      }
    }

    beforeEach(() => {
      stub(loader, 'load').returns({
        Module: function () {
          return {
            register: stub().returns({
              job: stub()
            })
          }
        },
        html: '<h1></h1>',
        name: 'xxx'
      })
      stub(datasource, 'load')
    })

    afterEach(() => {
      datasource.load.restore()
      loader.load.restore()
    })

    it('Registers widget data source', () => {
      const loadedDatasource = { foo: 'bar' }
      datasource.load.returns(loadedDatasource)

      const widget = new Widget(dashboard, renderOptions, 'abcdef', {})
      const ds = widget.datasource
      expect(ds).to.equal(loadedDatasource)
    })
  })

  context('Widget construction', () => {
    const dashboard = {
      layout: { rows: 4, columns: 5 },
      emitter: { emit: stub() }
    }

    it('Barf on unknown widget', () => {
      const badModuleName = resource('widgets/unknown')
      function fn () {
        return new Widget(dashboard, renderOptions, badModuleName)
      }
      expect(fn).to.throw(Error, /could not be located/)
    })

    it('Gains a dynamic id', () => {
      const module = resource('widgets/example')
      expect(new Widget(dashboard, renderOptions, module).id).to.exist()
    })

    it('Reads widget descriptor properties', () => {
      const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
      const job = widget.job
      expect(job).to.include({
        schedule: 1000
      })
      expect(job.script).to.be.a.function() 
    })

    context('Render model', () => {
      const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
      const { js } = widget.toRenderModel()

      it('Converts widget to render model', () => {
        const widgetId = widget.id
        expect(js).to.contain(`const widget_${widgetId} = new VudashWidgetExample({`)
        expect(js).to.contain(`target: document.getElementById("widget-container-${widgetId}")`)
        expect(js).to.contain('data: { config: {} }')
      })
    })

    it('Binds events on the client side', () => {
      const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
      const eventBinding = `
        socket.on('${widget.id}:update', ($data) => {
      `.trim()
      const rendered = widget.toRenderModel().js
      expect(rendered).to.include(eventBinding)
    })

    it('Binds component update', () => {
      const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
      const componentBinding = `widget_${widget.id}.update($data)`
      const rendered = widget.toRenderModel().js
      expect(rendered).to.include(componentBinding)
    })

    it('Loads jobs', () => {
      const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
      const job = widget.job
      expect(job.schedule).to.equal(1000)

    })

    it('Overrides config for jobs', () => {
      const overrides = {
        foo: 'baz',
        working: true
      }
      const widget = new Widget(dashboard, renderOptions, resource('widgets/configurable'), overrides)
      return widget.job.script().then((rawConfig) => {
        expect(rawConfig).to.equal(overrides)
      })
    })

    it('Does not override all config for jobs', () => {
      const overrides = {
        working: true
      }
      const widget = new Widget(dashboard, renderOptions, resource('widgets/configurable'), overrides)
      return widget.job.script().then((rawConfig) => {
        expect(rawConfig).to.equal({
          foo: 'bar',
          working: true
        })
      })
    })
  })

  context('Event Emitter', () => {
    const dashboard = {
      layout: { rows: 4, columns: 5 },
      emitter: { emit: stub() }
    }

    let expectedEmitFn

    class MyWidget {
      register (options, emitter) {
        expectedEmitFn = emitter
        return {}
      }
    }

    it('Recieves an event emitter on construction', () => {
      const widget = new Widget(dashboard, renderOptions, { html: 'hi', name: 'VudashMyWidget', Module: MyWidget })
      expect(widget).to.exist()
      expect(expectedEmitFn).to.be.a.function()
    })
  })
})
