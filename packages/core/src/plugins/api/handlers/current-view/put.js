'use strict'

module.exports = function (request, reply) {
  const { io } = request.server.plugins.socket
  const { dashboard } = request.payload
  io.emit('view:current', { dashboard })
  reply()
}
