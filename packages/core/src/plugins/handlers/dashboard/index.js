'use strict'

const dashboardLoader = require('../../../modules/dashboard/loader')
const { NotFoundError } = require('../../../errors')
const Boom = require('boom')

function load (cache, board, io, reply) {
  try {
    return dashboardLoader.find(cache, board, io)
  } catch (e) {
    if (e instanceof NotFoundError) {
      return reply.redirect('/')
    }
    throw e
  }
}

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
  const { dashboards } = server.plugins.dashboard
  try {
    const dashboard = load(dashboards, board, io, reply)
    const model = await buildViewModel(dashboard, server)
    return reply.view('dashboard', model)
  } catch (e) {
    console.log(e)
    return reply(Boom.boomify(e))
  }
}
