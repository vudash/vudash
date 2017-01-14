'use strict'

const socketio = require('socket.io')

const SocketPlugin = {
  register: function (server, options, next) {
    server.expose('io', socketio(server.listener))
    next()
  }
}

SocketPlugin.register.attributes = {
  name: 'socket',
  version: '1.0.0'
}

module.exports = SocketPlugin
