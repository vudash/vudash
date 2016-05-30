'use strict'

const Widget = require(fromSrc('modules/widget'))

describe('modules.widget', () => {
  it('Barf on unknown widget', (done) => {
    const badModuleName = resource('widgets/unknown')
    function fn () {
      return new Widget(badModuleName)
    }
    expect(fn).to.throw(Error, /Cannot find module /)
    done()
  })

  it('Gains a dynamic id', (done) => {
    const module = resource('widgets/example')
    expect(new Widget(module).id).to.exist()
    done()
  })

  it('Reads widget descriptor properties', (done) => {
    const widget = new Widget(resource('widgets/example'))
    const job = widget.getJob()
    expect(job).to.deep.include({
      schedule: 1000
    })
    expect(job.script).to.be.a.function()
    expect(widget.getJs()).to.include("function() { console.log('hello'); }")
    expect(widget.getCss()).to.equal('body { color: #fff; }')
    done()
  })

  it('Handles multiple files in properties', (done) => {
    const widget = new Widget(resource('widgets/multiple'))
    expect(widget.getJs()).to.contain('var one = 1;\nvar two = 2;')
    expect(widget.getCss()).to.equal('one { color: #fff; }\ntwo { color: #000; }')
    done()
  })

  it('Parses markup', (done) => {
    const widget = new Widget(resource('widgets/example'))
    expect(widget.getMarkup()).to.equal(`<h1 id="${widget.id}">Hello</h1>`)
    done()
  })

  it('Widget with missing properties', (done) => {
    const widget = new Widget(resource('widgets/missing'))
    expect(widget.getMarkup()).to.equal('')
    expect(widget.getCss()).to.equal('')
    expect(widget.getJs()).to.contain(`var widget_${widget.id} = {};`)
    done()
  })

  it('Widget with invalid properties', (done) => {
    const module = resource('widgets/broken')
    expect(() => { return new Widget(module) }).to.throw(Error, `Could not load widget component from ${module}/markup.html`)
    done()
  })

  it('Converts widget to render model', (done) => {
    const widget = new Widget(resource('widgets/example'))
    const renderModel = widget.toRenderModel()
    expect(renderModel).to.deep.include({
      css: widget.getCss(),
      markup: widget.getMarkup()
    })
    expect(renderModel.js).to.include(widget.getJs())
    done()
  })

  it('Binds events on the client side', (done) => {
    const widget = new Widget(resource('widgets/example'))
    const eventBinding = `
      socket.on('${widget.id}:update', function($id, $widget, $data) {
    `.trim()
    const componentBinding = `
      }('${widget.id}', widget_${widget.id}));
    `.trim()
    const rendered = widget.toRenderModel().js
    expect(rendered).to.include(eventBinding)
    expect(rendered).to.include(componentBinding)
    done()
  })

  it('Event is not bound if there is no update code', (done) => {
    const widget = new Widget(resource('widgets/neutral'))
    expect(widget.toRenderModel().js).not.to.include('socket.on')
    done()
  })

  it('Attaches update function to event', (done) => {
    const widget = new Widget(resource('widgets/example'))
    let update = `
      ${widget.update}
    `.trim()
    expect(widget.toRenderModel().js).to.include(update)
    done()
  })

  it('Loads jobs', (done) => {
    const widget = new Widget(resource('widgets/example'))
    const job = widget.getJob()
    expect(job.schedule).to.equal(1000)
    done()
  })

  it('Overrides config for jobs', (done) => {
    const overrides = {
      foo: 'baz',
      working: true
    }
    const widget = new Widget(resource('widgets/configurable'), overrides)
    const rawConfig = widget.getJob().script()
    expect(rawConfig).to.deep.equal(overrides)
    done()
  })

  it('Does not override all config for jobs', (done) => {
    const overrides = {
      working: true
    }
    const widget = new Widget(resource('widgets/configurable'), overrides)
    const rawConfig = widget.getJob().script()
    expect(rawConfig).to.deep.equal({
      foo: 'bar',
      working: true
    })
    done()
  })
})
