'use strict'

exports.render = function (id, name, config) {
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
