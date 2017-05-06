'use strict'

const Dashboard = require('../modules/dashboard')
const Path = require('path')
const Joi = require('joi')
const indexHandler = require('./handlers/index.handler')

const DashboardPlugin = {
  register: function (server, options, next) {
    const io = server.plugins.socket.io
    let dashboards = {}

    function loadDashboard (name) {
      const path = Path.join(process.cwd(), 'dashboards', name)
      const descriptor = require(path)
      const dashboard = new Dashboard(descriptor, io)
      dashboard.initialise()

      dashboards[name] = dashboard
      return dashboard
    }

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
        // TODO: Cache indefinitely using server methods.
        const dashboard = dashboards[dashboardName] || loadDashboard(dashboardName)
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

    server.expose('dashboards', dashboards)

    next()
  }
}

DashboardPlugin.register.attributes = {
  name: 'dashboard',
  version: '1.0.0',
  dependencies: ['socket']
}

module.exports = DashboardPlugin
