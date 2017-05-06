'use strict'

exports.render = function (id, widgetPosition, background) {
  const { top, left, width, height } = widgetPosition
  const rules = [
    `top:${top}%`,
    `left:${left}%`,
    `width:${width}%`,
    `height:${height}%`
  ]

  if (background) {
    rules.push(`background:${background}`)
  }

  return `#widget-container-${id}{${rules.join(';')}}`
}
