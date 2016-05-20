'use strict'

const Hapi = require('hapi')
const Hoek = require('hoek')
const server = new Hapi.Server()
const socketio = require('socket.io')

const src = (name) => { return `./src/${name}` }
const plugin = (name) => { return src(`plugins/${name}`) }

server.connection({ port: process.env.PORT || 3000 })

server.register([
  require('vision'),
  require('inert'),
  require(plugin('static')),
  require(plugin('dashboard'))
], (err) => {
  Hoek.assert(!err, err)

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: src('views')
  })

  server.start((err) => {
    Hoek.assert(!err, err)

    const io = socketio(server.listener)

    io.on('connection', function (socket) {
      socket.emit('Oh hii!')
    })

    console.log('Server running at:', server.info.uri)
  })
})
