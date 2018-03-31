'use strict'

const dashboardLoader = require('../../../../modules/dashboard/loader')
const { NotFoundError } = require('../../../../errors')
const Boom = require('boom')

async function buildViewModel (dashboard, server) {
  const serverUrl = server.settings.app.serverUrl
  const { name, app, css } = await dashboard.toRenderModel()
  return {
    serverUrl,
    name,
    app
  }
}

exports.handler = async function (request, reply) {
  const { board } = request.params
  const { server } = request
  const { io } = server.plugins.socket
  const { dashboards } = server.plugins.ui
  try {
    const dashboard = dashboardLoader.find(dashboards, board, io)
    const model = await buildViewModel(dashboard, server)
    return reply.view('dashboard', model)
  } catch (e) {
    console.error(e)
    if (e instanceof NotFoundError) {
      return reply.redirect('/')
    }
    console.log(e)
    return reply(Boom.boomify(e))
  }
}
