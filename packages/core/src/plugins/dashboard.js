'use strict'

const Joi = require('joi')
const indexHandler = require('./handlers/index.handler')
const dashboardLoader = require('../modules/dashboard/loader')
const { NotFoundError } = require('../errors')

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
      handler: function (request, reply) {
        const dashboardName = request.params.board

        const io = server.plugins.socket.io
        let dashboard
        try {
          dashboard = dashboardLoader.find(dashboardName, io)
        } catch (e) {
          if (e instanceof NotFoundError) {
            return reply.redirect('/')
          }
          throw e
        }
        const serverUrl = process.env.SERVER_URL || server.info.uri

        dashboard.toRenderModel()
        .then(({ name, html, js, css }) => {
          const { code, map } = js
          const model = {
            serverUrl,
            html,
            name,
            bundle: code,
            map,
            css
          }
          reply.view('dashboard', model)
        })
      }
    })

    server.route({
      method: '*',
      path: '/{p*}',
      handler: indexHandler
    })

    next()
  }
}

DashboardPlugin.register.attributes = {
  name: 'dashboard',
  version: '1.0.0',
  dependencies: ['socket']
}

module.exports = DashboardPlugin
