'use strict'

const { join } = require('path')

const AssetsPlugin = {
  register: function (server, options, next) {
    const root = join(__dirname, '..', '..', '..')

    server.route({
      method: 'GET',
      path: '/vendor/{param*}',
      handler: {
        directory: {
          path: join(root, 'node_modules')
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/assets/{param*}',
      handler: {
        directory: {
          path: join(root, 'src/public')
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
