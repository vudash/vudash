'use strict'

const renderer = require('.')
const WidgetPosition = require('../widget-position')
const Cheerio = require('cheerio')

describe('widget/renderer', () => {
  context('#renderScript()', () => {
    const id = 'abc'
    const config = { a: 'b' }
    let rendered
    
    before(done => {
      rendered = renderer.renderScript(id, 'AbcWidget', config)
      done()
    })
  
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

  context('#renderHtml()', () => {
    let $
    before((done) => {
      const widget = { id: 'xyz' }
      const markup = renderer.renderHtml(widget.id)
      $ = Cheerio.load(markup)
      done()
    })

    it('Has correct id', (done) => {
      expect($('div').attr('id')).to.equal('widget-container-xyz')
      done()
    })

    it('Has correct class', (done) => {
      expect($('div').hasClass('widget-container')).to.be.true()
      done()
    })
  })

  describe('#renderStyles()', () => {
    const widgetPosition = new WidgetPosition({
      rows: 4,
      columns: 5
    }, {
      x: 1, y: 2, w: 3, h: 4
    })

    const background = '#fff'

    context('Css', () => {
      let css
      before((done) => {
        css = renderer.renderStyles('xyz', widgetPosition, background)
        done()
      })

      it('Renders widget id', (done) => {
        expect(css).to.startWith('#widget-container-xyz{')
        done()
      })

      it('Renders background correctly', (done) => {
        expect(css).to.contain('background:#fff')
        done()
      })

      it('Renders position correctly', (done) => {
        expect(css).to.contain('left:20%;')
        expect(css).to.contain('top:50%;')
        expect(css).to.contain('width:60%;')
        expect(css).to.contain('height:100%;')
        done()
      })
    })

    context('No Background', () => {
      let css
      before((done) => {
        css = renderer.renderStyles('abc', widgetPosition, undefined)
        done()
      })

      it('Does not contain background rule', (done) => {
        expect(css).not.to.contain('background:')
        done()
      })
    })
  })
})
