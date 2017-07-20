'use strict'

const dashboardLoader = require('../../../modules/dashboard/loader')
const { NotFoundError } = require('../../../errors')

function load (board, io, reply) {
  try {
    return dashboardLoader.find(board, io)
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

  const dashboard = load(board, io, reply)
  const model = await buildViewModel(dashboard, server)
  return reply.view('dashboard', model)
}