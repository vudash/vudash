'use strict'

const Path = require('path')
const fs = require('fs')
const Boom = require('boom')

exports.handler = function (request, reply) {
  const defaultDashboard = process.env.DEFAULT_DASHBOARD
  if (defaultDashboard) {
    return reply.redirect(`/${defaultDashboard}.dashboard`)
  }

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
