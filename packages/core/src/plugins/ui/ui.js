'use strict'

const Joi = require('joi')
const { handler: indexHandler } = require('./handlers/index')
const { handler: dashboardHandler } = require('./handlers/dashboard')

const DashboardPlugin = {
  register: function (server, options, next) {
    server.route({
      method: 'GET',
      path: '/',
      handler: indexHandler
    })

    server.route({
      method: 'GET',
      path: '/{board}.dashboard',
      config: {
        validate: {
          params: {
            board: Joi.string().required().description('Board name')
          }
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

    next()
  }
}

DashboardPlugin.register.attributes = {
  name: 'ui',
  version: '1.0.0',
  dependencies: ['socket']
}

module.exports = DashboardPlugin
