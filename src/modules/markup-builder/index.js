'use strict'

const Handlebars = require('handlebars')

class MarkupBuilder {
  render (widget) {
    const template = Handlebars.compile(widget.markup)
    const inlineStyles = {
      top: `${widget.top}%`,
      left: `${widget.left}%`,
      width: `${widget.width}%`,
      height: `${widget.height}%`
    }

    if (widget.background) {
      Object.assign(inlineStyles, {
        background: widget.background
      })
    }

    const style = Object.keys(inlineStyles).reduce((css, key) => {
      const style = css += `${key}: ${inlineStyles[key]}`
      return style
    }, '')

    return `<div class="widget-container"
      style="${style}">
      ${template(widget)}
    </div>`
  }
}

module.exports = new MarkupBuilder()
