'use strict'

const dashboardLoader = require('../../../../modules/dashboard/loader')
const { NotFoundError } = require('../../../../errors')
const Boom = require('boom')

async function buildViewModel (dashboard, server) {
  const serverUrl = process.env.SERVER_URL || server.info.uri
  const { name, html, js, css } = await dashboard.toRenderModel()
  return {
    serverUrl,
    html,
    name,
    bundle: js.code,
    map: js.map,
    css
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
    if (e instanceof NotFoundError) {
      return reply.redirect('/')
    }
    console.log(e)
    return reply(Boom.boomify(e))
  }
}
