'use strict'

const { create } = require('modules/widget')
const { stub } = require('sinon')
const loader = require('./loader')
const { expect } = require('code')
const WidgetPosition = require('./widget-position')
const renderer = require('./renderer')

describe('widget', () => {
  describe('#create()', () => {
    it('has an auto-generated id', () => {
      const widget = create('xyz', {})
      expect(widget.id).to.exist()
    })

    it('has an auto-generated id', () => {
      const widget = create('xyz', {})
      expect(widget.options).to.equal({})
    })
  })

  describe('#register()', () => {
    let widget
    const register = stub()
    const options = { foo: 'bar' }
    const dashboardEmitter = { xyz: 'abc' }

    beforeEach(() => {
      stub(loader, 'load').returns({
        widget: { register }
      })
      widget = create('xyz', { options })
      widget.register(dashboardEmitter)
    })

    afterEach(() => {
      loader.load.restore()
    })

    it('widget is registered', () => {
      expect(register.callCount).to.equal(1)
    })

    it('registers options with widget', () => {
      expect(register.firstCall.args[0]).to.equal(options)
    })

    it('passes the emitter to the register method', () => {
      expect(register.firstCall.args[1]).to.equal(dashboardEmitter)
    })
  })

  describe('update', () => {
    let widget
    const data = { foo: 'bar' }

    beforeEach(() => {
      widget = create('xyz', {})
      widget.widget = { update: stub() }
      widget.update(data)
    })

    it('update calls widget update', () => {
      expect(widget.widget.update.callCount).to.equal(1)
    })

    it('calls with update data', () => {
      expect(widget.widget.update.firstCall.args[0]).to.equal(data)
    })
  })

  describe('#toRenderModel()', () => {
    let widget
    let renderModel

    const dashboardLayout = { rows: 1, columns: 1 }
    const background = '#fff'
    const options = { foo: 'bar' }

    beforeEach(() => {
      stub(renderer, 'renderHtml').returns('html')
      stub(renderer, 'renderStyles').returns('css')
      stub(renderer, 'renderScript').returns('js')

      widget = create('xxx', { options, background })
      widget.id = 'my-id'
      widget.name = 'some-widget'
      widget.componentPath = 'xyz'
      renderModel = widget.toRenderModel(dashboardLayout)
    })

    afterEach(() => {
      renderer.renderHtml.restore()
      renderer.renderStyles.restore()
      renderer.renderScript.restore()
    })

    describe('renders HTML', () => {
      it('renders html', () => {
        expect(renderer.renderHtml.callCount).to.equal(1)
      })

      it('passes id to html renderer', () => {
        expect(renderer.renderHtml.firstCall.args[0]).to.equal(widget.id)
      })
    })

    describe('renders styles', () => {
      it('renders css', () => {
        expect(renderer.renderStyles.callCount).to.equal(1)
      })

      it('passes id to style renderer', () => {
        expect(renderer.renderStyles.firstCall.args[0]).to.equal(widget.id)
      })

      it('passes position to style renderer', () => {
        expect(renderer.renderStyles.firstCall.args[1]).to.be.an.instanceOf(WidgetPosition)
      })

      it('passes background to style renderer', () => {
        expect(renderer.renderStyles.firstCall.args[2]).to.equal(background)
      })
    })

    describe('renders scripts', () => {
      it('renders js', () => {
        expect(renderer.renderScript.callCount).to.equal(1)
      })

      it('passes id to style renderer', () => {
        expect(renderer.renderScript.firstCall.args[0]).to.equal(widget.id)
      })

      it('passes position to style renderer', () => {
        expect(renderer.renderScript.firstCall.args[1]).to.equal(widget.name)
      })

      it('passes background to style renderer', () => {
        expect(renderer.renderScript.firstCall.args[2]).to.equal(options)
      })
    })

    describe('rendered model', () => {
      it('outputs model for renderer', () => {
        expect(renderModel).to.equal({
          id: widget.id,
          name: widget.name,
          componentPath: widget.componentPath,
          markup: 'html',
          css: 'css',
          js: 'js'
        })
      })
    })
  })
})
