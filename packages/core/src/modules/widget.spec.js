const Widget = require(fromSrc('modules/widget'))
const sinon = require('sinon')

describe('modules.widget', () => {
  const dashboard = { layout: { rows: 4, columns: 5 }, emitter: { emit: sinon.stub() } }
  const position = { x: 0, y: 0, w: 1, h: 1 }
  const renderOptions = { position }

  it('Barf on unknown widget', (done) => {
    const badModuleName = resource('widgets/unknown')
    function fn () {
      return new Widget(dashboard, renderOptions, badModuleName)
    }
    expect(fn).to.throw(Error, /Cannot find module /)
    done()
  })

  it('Gains a dynamic id', (done) => {
    const module = resource('widgets/example')
    expect(new Widget(dashboard, renderOptions, module).id).to.exist()
    done()
  })

  it('Reads widget descriptor properties', (done) => {
    const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
    const job = widget.getJob()
    expect(job).to.deep.include({
      schedule: 1000
    })
    expect(job.script).to.be.a.function()
    done()
  })

  it('Converts widget to render model', (done) => {
    const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
    const renderModel = widget.toRenderModel()
    expect(renderModel.js).to.contain('var VudashWidgetExample = (function')
    done()
  })

  it('Binds events on the client side', (done) => {
    const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
    const eventBinding = `
      socket.on('${widget.id}:update', function($id, $widget, $data) {
    `.trim()
    const rendered = widget.toRenderModel().js
    expect(rendered).to.include(eventBinding)
    done()
  })

  it('Binds component update', (done) => {
    const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
    const componentBinding = `
      widget_${widget.id}.update($data);
    `.trim()
    const rendered = widget.toRenderModel().js
    expect(rendered).to.include(componentBinding)
    done()
  })

  it('Loads jobs', (done) => {
    const widget = new Widget(dashboard, renderOptions, resource('widgets/example'))
    const job = widget.getJob()
    expect(job.schedule).to.equal(1000)
    done()
  })

  it('Overrides config for jobs', (done) => {
    const overrides = {
      foo: 'baz',
      working: true
    }
    const widget = new Widget(dashboard, renderOptions, resource('widgets/configurable'), overrides)
    return widget.getJob().script().then((rawConfig) => {
      expect(rawConfig).to.deep.equal(overrides)
    })
  })

  it('Does not override all config for jobs', (done) => {
    const overrides = {
      working: true
    }
    const widget = new Widget(dashboard, renderOptions, resource('widgets/configurable'), overrides)
    return widget.getJob().script().then((rawConfig) => {
      expect(rawConfig).to.deep.equal({
        foo: 'bar',
        working: true
      })
    })
  })

  context('Event Emitter', () => {
    let expectedEmitFn

    class MyWidget {
      register (options, emitter) {
        expectedEmitFn = emitter
        return {}
      }
    }

    it('Recieves an event emitter on construction', (done) => {
      new Widget(dashboard, renderOptions, { html: 'hi', name: 'VudashMyWidget', Module: MyWidget })
      expect(expectedEmitFn).to.be.a.function()
      done()
    })
  })

  context('Third Party libraries', () => {
    it('Renders JS', (done) => {
      const widget = new Widget(dashboard, renderOptions, resource('widgets/third-party'))
      const js = widget.toRenderModel().providedJs
      expect(js).not.to.be.undefined()
      done()
    })

    it('Renders CSS', (done) => {
      const widget = new Widget(dashboard, renderOptions, resource('widgets/third-party'))
      const css = widget.toRenderModel().providedCss
      expect(css).not.to.be.undefined()
      done()
    })
  })
})
