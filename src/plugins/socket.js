'use strict'

const socketio = require('socket.io')

const SocketPlugin = {
  register: function (server, options, next) {
    const io = socketio(server.listener)
    let sock

    io.on('connection', (socket) => {
      sock = socket
    })

    server.method('emit', function (event, data) {
      if (!sock) { return }
      sock.emit(event, data)
    }, {bind: this})

    next()
  }
}

SocketPlugin.register.attributes = {
  name: 'socket',
  version: '1.0.0'
}

module.exports = SocketPlugin
