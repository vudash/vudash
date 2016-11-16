'use strict'

class CssBuilder {
  build (id, providedCss, widgetPosition, background) {
    return `#widget-container-${id} {
        background: ${background};
        top: ${widgetPosition.top}%;
        left: ${widgetPosition.left}%;
        width: ${widgetPosition.width}%;
        height: ${widgetPosition.height}%;
      }`
  } 
}

module.exports = new CssBuilder()