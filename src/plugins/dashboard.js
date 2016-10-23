'use strict'

const Dashboard = require('../modules/dashboard')
const Path = require('path')
const Joi = require('joi')
const fs = require('fs')
const Boom = require('boom')

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
      handler: function (request, reply) {
        const path = Path.join(process.cwd(), 'dashboards')
        fs.readdir(path, (err, files) => {
          if (err) { return reply(Boom.wrap(err, 400)) }
          const boards = files.map((file) => {
            return {
              link: file.replace('json', 'dashboard'),
              name: file.replace('.json', '')
            }
          })
          reply.view('listing', { boards })
        })
      }
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
        const name = request.params.board
        const dashboard = dashboards[name] || loadDashboard(name)

        reply.view('dashboard', {serverUrl: `${process.env.SERVER_URL || server.info.uri}`, dashboard: dashboard.toRenderModel()})
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
