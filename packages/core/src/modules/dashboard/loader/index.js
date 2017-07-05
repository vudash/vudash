'use strict'

const { NotFoundError } = require('../../../errors')
const Dashboard = require('..')
const Path = require('path')
const fs = require('fs')

const dashboards = {}

// TODO: Cache indefinitely using server methods.
function load (name, io) {
  const path = `${Path.join(process.cwd(), 'dashboards', name)}.json`
  if (!fs.existsSync(path)) {
    throw new NotFoundError(`Dashboard ${name} does not exist.`)
  }

  const descriptor = require(path)
  const dashboard = new Dashboard(descriptor, io)
  dashboard.initialise()

  dashboards[name] = dashboard
  return dashboard
}

function find (name, io) {
  return dashboards[name] || load(name, io)
}

module.exports = {
  find,
  load
}
