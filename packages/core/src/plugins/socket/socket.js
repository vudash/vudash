'use strict'

const socketio = require('socket.io')

module.exports = {
  name: 'socket',
  version: '1.0.0',
  register: async function (server, options) {
    server.expose('io', socketio(server.listener))
  }
}
