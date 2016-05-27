'use strict'

const AssetsPlugin = {
  register: function (server, options, next) {
    server.route({
      method: 'GET',
      path: '/static/{param*}',
      handler: {
        directory: {
          path: 'node_modules'
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/assets/{param*}',
      handler: {
        directory: {
          path: 'src/public'
        }
      }
    })

    next()
  }
}

AssetsPlugin.register.attributes = {
  name: 'assets',
  version: '1.0.0'
}

module.exports = AssetsPlugin
