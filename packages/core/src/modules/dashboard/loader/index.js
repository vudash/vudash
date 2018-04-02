'use strict'

const { NotFoundError } = require('../../../errors')
const Dashboard = require('..')
const Path = require('path')
const fs = require('fs')

function notFound (name) {
  throw new NotFoundError(`Dashboard ${name} does not exist.`)
}

// TODO: Cache indefinitely using server methods.
function load (cache, name, io) {
  const path = `${Path.join(process.cwd(), 'dashboards', name)}.json`
  if (!fs.existsSync(path)) {
    notFound(name)
  }

  const cached = find(cache, name)
  if (cached) {
    return cached
  }

  const descriptor = require(path)
  const dashboard = Dashboard.create(descriptor, io)
  dashboard.loadDatasources()
  dashboard.loadWidgets()

  cache[name] = dashboard
  return dashboard
}

function find (cache, name) {
  return cache[name] || notFound(name)
}

module.exports = {
  find,
  load
}
