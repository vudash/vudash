'use strict'

class CssBuilder {
  build (id, widgetPosition, background) {

    const rules = [
      `top:${widgetPosition.top}%`,
      `left:${widgetPosition.left}%`,
      `width:${widgetPosition.width}%`,
      `height:${widgetPosition.height}%`
    ]

    if (background) {
      rules.push(`background:${background}`)
    }

    return `#widget-container-${id}{${rules.join(';')}}`
  } 
}

module.exports = new CssBuilder()