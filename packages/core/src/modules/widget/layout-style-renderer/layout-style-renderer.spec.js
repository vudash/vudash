'use strict'

const layoutStyleRenderer = require('.')
const WidgetPosition = require('../widget-position')

describe('layout-style-renderer', () => {
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
      css = layoutStyleRenderer.render('xyz', widgetPosition, background)
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
      css = layoutStyleRenderer.render('abc', widgetPosition, undefined)
      done()
    })

    it('Does not contain background rule', (done) => {
      expect(css).not.to.contain('background:')
      done()
    })
  })
})
