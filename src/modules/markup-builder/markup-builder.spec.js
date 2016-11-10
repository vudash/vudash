'use strict'

const markupBuilder = require('.')

describe('modules/markup-builder', () => {
  context('Build Markup', () => {
    const position = { x: 1, y: 1, w: 1, h: 1 }
    it('Applies widget background', (done) => {
      const widget = { position, background: 'xxx' }
      const markup = markupBuilder.render(widget)
      expect(markup).to.contain('background: xxx')
      done()
    })

    it('No widget background', (done) => {
      const widget = { position }
      const markup = markupBuilder.render(widget)
      expect(markup).not.to.contain('background:')
      done()
    })
  })
})
