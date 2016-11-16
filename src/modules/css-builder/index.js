'use strict'

class CssBuilder {
  build (id, providedCss, widgetPosition, background) {

    const rules = [
      `top:${widgetPosition.top}%`,
      `left:${widgetPosition.left}%`,
      `width:${widgetPosition.width}%`,
      `height:${widgetPosition.height}%`
    ]

    if (background) {
      rules.push(`background:${background}`)
    }

    const css = [
      `#widget-container-${id}{${rules.join(';')}}`,
      providedCss
    ]

    return css.join('\n')
  } 
}

module.exports = new CssBuilder()