'use strict'

const { reach } = require('hoek')
const chalk = require('chalk')
const { PluginRegistrationError } = require('../../../errors')
const pluginResolver = require('./plugin-resolver')

class PluginLoader {

  constructor (id, dashboard) {
    this.dashboard = dashboard
    this.id = id
  }

  load (config) {
    this.options = config.options
    const plugin = pluginResolver.resolve(config.module)
    plugin.register(this)
  }

  contributeDatasource (constructorFunction, validation) {
    const fetchMethod = reach(constructorFunction, 'prototype.fetch')
    if (!fetchMethod || typeof fetchMethod !== 'function') {
      throw new PluginRegistrationError(`Plugin ${this.id} does not appear to be a data-source provider`)
    }
    console.info(`Adding datasource ${chalk.bold.magenta(this.id)}`)
    this.dashboard.datasources = this.dashboard.datasources || {}
    this.dashboard.datasources[this.id] = { Constructor: constructorFunction, validation, options: this.options }
  }

}

module.exports = PluginLoader
