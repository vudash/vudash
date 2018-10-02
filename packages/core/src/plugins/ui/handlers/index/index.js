'use strict'

const Path = require('path')
const { readdirSync } = require('fs')
const { internal } = require('boom')
const { join } = require('path')

function loadFromDisk (boards) {
  const path = Path.join(process.cwd(), 'dashboards')
  const files = readdirSync(path)
  return files.reduce((curr, d) => {
    const descriptor = require(join(path, d))
    curr.add({
      name: descriptor.name,
      path: '/' + d.replace('.json', '') + '.dashboard'
    })
    return curr
  }, boards)
}

function loadFromCache (boards, request) {
  const { dashboards } = request.server.plugins.ui
  return Object.keys(dashboards).reduce((curr, d) => {
    curr.add(d)
    return curr
  }, boards)
}

exports.handler = function (request, reply) {
  const defaultDashboard = process.env.DEFAULT_DASHBOARD
  if (defaultDashboard) {
    return reply.redirect(`/${defaultDashboard}.dashboard`)
  }

  try {
    const boards = new Set()
    loadFromDisk(boards)
    loadFromCache(boards, request)
    reply.view('listing', { boards: Array.from(boards) })
  } catch (e) {
    return reply(internal(e))
  }
}
