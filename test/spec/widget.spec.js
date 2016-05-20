'use strict'

const Widget = require(fromSrc('modules/widget'))

describe('modules.widget', () => {
  it('Loads a widget', (done) => {
    const path = resource('widgets/example')
    const widget = new Widget(path)
    expect(widget.getMarkup()).to.equal('<h1>Hello</h1>')
    done()
  })

  it('Barf on unknown widget', (done) => {
    const path = resource('widgets/unknown')

    function fn() {
      const widget = new Widget(path)
    }

    expect(fn).to.throw(Error, `Could not load widget from ${path}`)
    done()
  })

})
