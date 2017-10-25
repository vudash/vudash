'use strict'

const renderer = require('.')
const WidgetPosition = require('../widget-position')
const Cheerio = require('cheerio')

describe('widget/renderer', () => {
  context('#renderScript()', () => {
    const id = 'abc'
    const config = { a: 'b' }
    let rendered
    
    before(() => {
      rendered = renderer.renderScript(id, 'AbcWidget', config)
    })
  
    it('update method is rendered', () => {
      expect(rendered).to.include("socket.on('abc:update', ($data) => {")
    })

    it('target is set correctly', () => {
      expect(rendered).to.include('target: document.getElementById("widget-container-abc")')
    })

    it('error handling exists', () => {
      expect(rendered).to.include('Widget "abc" encountered error')
    })

    it('default data contains config', () => {
      expect(rendered).to.include('data: { config: {"a":"b"} }')
    })

    it('widget update method is called', () => {
      expect(rendered).to.include('widget_abc.update($data)')
    })

    it('component is rendered', () => {
      expect(rendered).to.startWith('const widget_abc = new AbcWidget')
    })
  })

  context('#renderHtml()', () => {
    let $
    before(() => {
      const widget = { id: 'xyz' }
      const markup = renderer.renderHtml(widget.id)
      $ = Cheerio.load(markup)
    })

    it('Has correct id', () => {
      expect($('div').attr('id')).to.equal('widget-container-xyz')
    })

    it('Has correct class', () => {
      expect($('div').hasClass('widget-container')).to.be.true()
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
      before(() => {
        css = renderer.renderStyles('xyz', widgetPosition, background)
      })

      it('Renders widget id', () => {
        expect(css).to.startWith('#widget-container-xyz{')
      })

      it('Renders background correctly', () => {
        expect(css).to.contain('background:#fff')
      })

      it('Renders position correctly', () => {
        expect(css).to.contain('left:20%;')
        expect(css).to.contain('top:50%;')
        expect(css).to.contain('width:60%;')
        expect(css).to.contain('height:100%;')
      })
    })

    context('No Background', () => {
      let css
      before(() => {
        css = renderer.renderStyles('abc', widgetPosition, undefined)
      })

      it('Does not contain background rule', () => {
        expect(css).not.to.contain('background:')
      })
    })
  })
})
