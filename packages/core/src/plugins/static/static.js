'use strict'

const { join } = require('path')

module.exports = {
  name: 'assets',
  version: '1.0.0',
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/assets/{param*}',
      handler: {
        directory: {
          path: join(__dirname, '..', '..', '..', 'src/public')
        }
      }
    })
  }
}
