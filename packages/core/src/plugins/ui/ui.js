'use strict'

const Joi = require('joi')
const { handler: indexHandler } = require('./handlers/index')
const { handler: dashboardHandler } = require('./handlers/dashboard')

module.exports = {
  name: 'ui',
  version: '1.0.0',
  dependencies: ['socket'],
  register: async function (server, options) {
    server.route({
      method: 'GET',
      path: '/',
      handler: indexHandler
    })

    server.route({
      method: 'GET',
      path: '/{board}.dashboard',
      options: {
        validate: {
          params: {
            board: Joi.string().required().description('Board name')
          }
        },
        cache: {
          expiresIn: 15 * 60 * 1000,
          privacy: 'private'
        }
      },
      handler: dashboardHandler
    })

    server.route({
      method: '*',
      path: '/{p*}',
      handler: indexHandler
    })

    server.expose('dashboards', {})
  }
}
