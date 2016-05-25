'use strict'

const Widget = require(fromSrc('modules/widget'))

describe('modules.widget', () => {
  it('Barf on unknown widget', (done) => {
    const path = 'test/resources/widgets/unknown'
    function fn () {
      return new Widget(path)
    }
    expect(fn).to.throw(Error, `Could not load widget from ${process.cwd()}/${path}`)
    done()
  })

  it('Gains a dynamic id', (done) => {
    const path = 'test/resources/widgets/example'
    expect(new Widget(path).id).to.exist()
    done()
  })

  it('Reads widget descriptor properties', (done) => {
    const path = 'test/resources/widgets/example'
    const widget = new Widget(path)
    const job = widget.getJob()
    expect(job).to.deep.include({
      schedule: 1000
    })
    expect(job.script).to.be.a.function()
    expect(widget.getClientsideJs()).to.include("function() { console.log('hello'); }")
    expect(widget.getCss()).to.equal('body { color: #fff; }')
    done()
  })

  it('Parses markup', (done) => {
    const path = 'test/resources/widgets/example'
    const widget = new Widget(path)
    expect(widget.getMarkup()).to.equal(`<h1 id="${widget.id}">Hello</h1>`)
    done()
  })

  it('Widget with missing properties', (done) => {
    const path = 'test/resources/widgets/missing'
    const widget = new Widget(path)
    expect(widget.getMarkup()).to.equal('')
    expect(widget.getCss()).to.equal('')
    expect(widget.getClientsideJs()).to.equal('')
    done()
  })

  it('Default widget width is four', (done) => {
    const path = 'test/resources/widgets/example'
    const widget = new Widget(path)
    expect(widget.getWidth()).to.equal('eight')
    done()
  })

  it('Widget with invalid properties', (done) => {
    const path = 'test/resources/widgets/broken'
    function fn () {
      return new Widget(path)
    }
    expect(fn).to.throw(Error, `Could not load widget component from ${process.cwd()}/${path}/markup.html`)
    done()
  })

  it('Converts widget to render model', (done) => {
    const widget = new Widget('widgets/time')
    const renderModel = widget.toRenderModel()
    expect(renderModel).to.deep.include({
      css: widget.getCss(),
      markup: widget.getMarkup()
    })
    expect(renderModel.js).to.include(widget.getClientsideJs())
    done()
  })

  it('Binds events on the client side', (done) => {
    const widget = new Widget('test/resources/widgets/example')
    let bound = `
    socket.on('${widget.id}:update', widget_${widget.id}.handleEvent.bind(widget_${widget.id}))
    `.trim()
    expect(widget.toRenderModel().js).to.include(bound)
    done()
  })

  it('Event is not bound if there is no update code', (done) => {
    const widget = new Widget('test/resources/widgets/neutral')
    expect(widget.toRenderModel().js).to.equal('')
    done()
  })

  it('Attaches update function to event', (done) => {
    const widget = new Widget('test/resources/widgets/example')
    let update = `
      update: ${widget.update}
    `.trim()
    expect(widget.toRenderModel().js).to.include(update)
    done()
  })

  it('Loads jobs', (done) => {
    const widget = new Widget('test/resources/widgets/example')
    const job = widget.getJob()
    expect(job.schedule).to.equal(1000)
    done()
  })

  it('Overrides config for jobs', (done) => {
    const overrides = {
      foo: 'baz',
      working: true
    }
    const widget = new Widget('test/resources/widgets/configurable', overrides)
    const job = widget.getJob()
    expect(job.config).to.deep.equal(overrides)
    done()
  })

  it('Does not override all config for jobs', (done) => {
    const overrides = {
      working: true
    }
    const widget = new Widget('test/resources/widgets/configurable', overrides)
    const job = widget.getJob()
    expect(job.config).to.deep.equal({
      foo: 'bar',
      working: true
    })
    done()
  })
})
