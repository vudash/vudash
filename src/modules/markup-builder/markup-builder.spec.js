'use strict'

const Cheerio = require('cheerio')
const markupBuilder = require('.')

describe('modules/markup-builder', () => {
  context('Build Markup', () => {
    let $
    before((done) => {
      const widget = { id: 'xyz', markup: '<h1>hi</h1>' }
      const markup = markupBuilder.render(widget)
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
})
