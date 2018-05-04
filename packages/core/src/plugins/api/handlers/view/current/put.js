'use strict'

module.exports = function (request, h) {
  const { io } = request.server.plugins.socket
  const { dashboard } = request.payload
  io.emit('view:current', { dashboard })
  return h.code(200)
}
