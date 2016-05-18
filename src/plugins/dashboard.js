'use strict'

const DashboardPlugin = {
  register: function (server, options, next) {
    server.route({
      method: 'GET',
      path: '/{board}',
      handler: function (request, reply) {
        reply.view('dashboard')
      }
    })

    next()
  }
}

DashboardPlugin.register.attributes = {
  name: 'dashboard',
  version: '1.0.0'
}

module.exports = DashboardPlugin
