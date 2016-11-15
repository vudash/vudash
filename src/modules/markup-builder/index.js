'use strict'

const Handlebars = require('handlebars')

class MarkupBuilder {
  render (widget) {
    const template = Handlebars.compile(widget.markup)

    return `<div id="widget-container-${widget.id}" class="widget-container">
      ${template(widget)}
    </div>`
  }
}

module.exports = new MarkupBuilder()
