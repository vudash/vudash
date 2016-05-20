'use strict'

const Widget = require(fromSrc('modules/widget'))

describe('modules.widget', () => {
  it('Barf on unknown widget', (done) => {
    const path = 'test/resources/widgets/unknown'
    function fn() {
      const widget = new Widget(path)
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
    expect(widget.getMarkup()).to.equal('<h1>Hello</h1>')
    expect(widget.getJs()).to.equal("function() { console.log('hello'); }")
    expect(widget.getCss()).to.equal("body { color: #fff; }")
    done()
  })

  it('Widget with missing properties', (done) => {
    const path = 'test/resources/widgets/missing'
    const widget = new Widget(path)
    expect(widget.getMarkup()).to.equal('')
    expect(widget.getJs()).to.equal('')
    expect(widget.getCss()).to.equal('')
    done()
  })

  it('Widget with missing properties', (done) => {
    const path = 'test/resources/widgets/broken'
    function fn() {
      const widget = new Widget(path)
    }
    expect(fn).to.throw(Error, `Could not load widget component from ${process.cwd()}/${path}/markup.html`)
    done()
  })

  it('Converts widget to render model', (done) => {
    const widget = new Widget('widgets/time')
    expect(widget.toRenderModel()).to.deep.equal({
        js: widget.getJs(),
        css: widget.getCss(),
        markup: widget.getMarkup()
    })
    done()
  })

  it('Reads events', (done) => {
    const widget = new Widget('test/resources/widgets/example')
    let events = {}
    events[`${widget.id}:my-event`] = "alert('oh hi')"
    expect(widget.events).to.deep.equal(events)
    done()
  })

})
