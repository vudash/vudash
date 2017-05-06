'use strict'

const renderer = require('.')

describe('component-renderer', () => {
  context('Config', () => {
    const id = 'abc'
    const config = { a: 'b' }
    const rendered = renderer.render(id, 'AbcWidget', config)

    it('update method is rendered', done => {
      expect(rendered).to.include("socket.on('abc:update', ($data) => {")
      done()
    })

    it('target is set correctly', done => {
      expect(rendered).to.include('target: document.getElementById("widget-container-abc")')
      done()
    })

    it('error handling exists', done => {
      expect(rendered).to.include('Widget "abc" encountered error')
      done()
    })

    it('default data contains config', done => {
      expect(rendered).to.include('data: { config: {"a":"b"} }')
      done()
    })

    it('widget update method is called', done => {
      expect(rendered).to.include('widget_abc.update($data)')
      done()
    })

    it('component is rendered', done => {
      expect(rendered).to.startWith('const widget_abc = new AbcWidget')
      done()
    })
  })
})
