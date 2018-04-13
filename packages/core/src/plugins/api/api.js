'use strict'

const Joi = require('joi')
const viewCurrentHandlers = require('./handlers/view/current')
const dashboardHandlers = require('./handlers/dashboards')

const ApiPlugin = {
  register: function (server, options, next) {
    server.route({
      method: 'PUT',
      path: '/api/v1/view/current',
      config: {
        tags: ['api'],
        validate: {
          payload: {
            dashboard: Joi.string().required().description('Dashboard to switch to')
          }
        }
      },
      handler: viewCurrentHandlers.put
    })

    server.route({
      method: 'PUT',
      path: '/api/v1/dashboards/{name}',
      config: {
        tags: ['api'],
        validate: {
          params: {
            name: Joi.string().required().description('Dashboard id')
          },
          payload: {
            descriptor: Joi.object().required().description('Dashboard descriptor')
          }
        }
      },
      handler: dashboardHandlers.put
    })

    next()
  }
}

ApiPlugin.register.attributes = {
  name: 'api',
  version: '1.0.0',
  dependencies: ['hapi-api-secret-key']
}

module.exports = ApiPlugin
