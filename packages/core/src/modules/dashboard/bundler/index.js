'use strict'

const base = `
  const VUDASH = window.VUDASH
  const socket = io(VUDASH.config.serverUrl)

  socket.on('error', function(e) {
    console.error('Error.', e)
  })

  socket.on('audio:play', function (data) {
    VUDASH.player.play(data.data)
  })
`

exports.build = function (widgets) {
  const model = widgets.reduce((curr, { name, markup, css, js, componentPath }) => {
    curr.imports.push(`import ${name} from '${componentPath}'`)
    curr.containers.push(markup)
    curr.css.push(css)
    curr.events.push(js)
    return curr
  }, { imports: [], containers: [], events: [], css: [] })

  const imports = [ ...new Set(model.imports) ]

  const js = `
    'use strict'
    ${imports.join('\n')}
    ${base}
    ${model.events.join('\n')}
  `

  const html = `
    <style>
      ${model.css.join('\n')}
    </style>

    ${model.containers.join('\n')}
  `
  return { js, html }
}
