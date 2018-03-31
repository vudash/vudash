'use strict'

const base = `
  const VUDASH = window.VUDASH
  const socket = io(VUDASH.config.serverUrl)

  socket.on('error', function (e) {
    iziToast.show({
      title: 'Socket Error',
      theme: 'dark',
      color: 'red',
      message: e.message,
      timeout: 5000,
      onOpen: function () {
        console.error(e)
      }
    })
  })

  socket.on('disconnect',function () {
    iziToast.show({
      id: 'disconnect',
      title: 'Socket Disconnected',
      theme: 'light',
      color: 'red',
      message: 'Will reload soon to restore connection...',
      timeout: ${process.env.DISCONNECT_RELOAD_TIMEOUT} || 30000,
      onClosed: function () {
        window.location.reload()
      }
    })
  })

  socket.on('audio:play', function (data) {
    VUDASH.player.play(data.data)
  })

  socket.on('view:current', function (data) {
    window.location.pathname = '/' + data.dashboard + '.dashboard'
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
