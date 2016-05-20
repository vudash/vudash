'use strict'

const Dashboard = require('../modules/dashboard')
const Path = require('path')
const Joi = require('joi')

const DashboardPlugin = {
  register: function (server, options, next) {
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
        const path = Path.join(process.cwd(), 'dashboards', `${request.params.board}`)
        const descriptor = require(path)
        const dashboard = new Dashboard(descriptor)
        reply.view('dashboard', dashboard.toRenderModel())
      }
    })

    next()
  }
}

DashboardPlugin.register.attributes = {
  name: 'dashboard',
  version: '1.0.0'
}

module.exports = DashboardPlugin
