'use strict'

const dashboardLoader = require('../../../../dashboard/loader')
const { NotFoundError } = require('../../../../errors')
const Boom = require('boom')

async function buildViewModel (dashboard, server) {
  const serverUrl = server.settings.app.serverUrl
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

exports.handler = async function (request, h) {
  const { board } = request.params
  const { server } = request
  const { io } = server.plugins.socket
  const { dashboards } = server.plugins.ui
  try {
    const dashboard = dashboardLoader.find(dashboards, board, io)
    const model = await buildViewModel(dashboard, server)
    return h.view('dashboard', model)
  } catch (e) {
    console.error(e)
    if (e instanceof NotFoundError) {
      return h.redirect('/')
    }
    return Boom.boomify(e, { statusCode: 400 })
  }
}
