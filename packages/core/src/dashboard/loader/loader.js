'use strict'

const { NotFoundError } = require('../../errors')
const Dashboard = require('..')
const fs = require('fs')
const { join } = require('path')

function load (cache, name, io) {
  const path = join(process.cwd(), 'dashboards', `${name}.json`)

  if (!fs.existsSync(path)) {
    throw new NotFoundError(`Dashboard ${name} does not exist.`)
  }

  const descriptor = require(path)
  return add(cache, name, io, descriptor)
}

function add (cache, name, io, descriptor) {
  const dashboard = Dashboard.create(descriptor, io)
  dashboard.loadDatasources()
  dashboard.loadWidgets()

  cache[name] = dashboard
  return cache[name]
}

function find (cache, name, io) {
  return cache[name] || load(cache, name, io)
}

function has (cache, name) {
  return !!cache[name]
}

module.exports = {
  find,
  has,
  add,
  load
}
