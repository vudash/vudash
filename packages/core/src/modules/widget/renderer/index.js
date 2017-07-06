'use strict'

exports.renderScript = function (id, name, config) {
  return `
    const widget_${id} = new ${name}({ 
      target: document.getElementById("widget-container-${id}"), 
      data: { config: ${JSON.stringify(config)} }
    });

    socket.on('${id}:update', ($data) => {
      if ($data.error) {
        console.error('Widget "${id}" encountered error: ' + $data.error.message)
      }
      widget_${id}.update($data)
    })
  `.trim()
}

exports.renderHtml = function (id) {
  return `<div id="widget-container-${id}" class="widget-container"></div>`
}

exports.renderStyles = function (id, widgetPosition, background) {
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