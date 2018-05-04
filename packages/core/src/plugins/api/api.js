'use strict'

const Joi = require('joi')
const viewCurrentHandlers = require('./handlers/view/current')
const dashboardHandlers = require('./handlers/dashboards')

module.exports = {
  name: 'api',
  version: '1.0.0',
  dependencies: ['hapi-api-secret-key'],
  register: async function (server, options) {
    server.route({
      method: 'PUT',
      path: '/api/v1/view/current',
      options: {
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
      options: {
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
  }
}
