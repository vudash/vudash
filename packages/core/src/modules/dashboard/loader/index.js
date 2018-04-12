'use strict'

const { NotFoundError } = require('../../../errors')
const Dashboard = require('..')
const fs = require('fs')
const { join } = require('path')

function load (cache, name, io) {
  const path = join(process.cwd(), 'dashboards', `${name}.json`)

  if (!fs.existsSync(path)) {
    throw new NotFoundError(`Dashboard ${name} does not exist.`)
  }

  const descriptor = require(path)
  const dashboard = Dashboard.create(descriptor, io)
  dashboard.loadDatasources()
  dashboard.loadWidgets()

  cache[name] = dashboard
  return dashboard
}

function find (cache, name, io) {
  return cache[name] || load(cache, name, io)
}

module.exports = {
  find,
  load
}
