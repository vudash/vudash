'use strict'

const Emitter = require('./emitter')
const id = require('./id-gen')
const descriptorParser = require('./descriptor-parser')
const assetBuilder = require('./asset-builder')
const { PluginRegistrationError } = require('../errors')
const WidgetConstructor = require('./widget-constructor')

class Dashboard {
  constructor (json, io) {
    const descriptor = descriptorParser.parse(json)

    this.datasources = {}

    this.id = id()
    this.name = descriptor.name
    this.assets = assetBuilder.build(descriptor.assets)
    this.sharedConfig = descriptor['shared-config']
    this.emitter = new Emitter(io, this.id)
    this.layout = descriptor.layout

    this.widgetConstructor = new WidgetConstructor(this, this.sharedConfig)
    this.widgets = descriptor.widgets.map((fd) => {
      return this.widgetConstructor.register(fd)
    })
  }

  initialise () {
    this.buildJobs()
  }

  getWidgets () {
    return this.widgets
  }

  getJobs () {
    return this.jobs
  }

  getAssets () {
    return this.assets
  }

  contributeDatasource (name, datasource) {
    if (!Object.keys(datasource).includes('fetch')) {
      throw new PluginRegistrationError(`Plugin ${name} does not appear to be a data-source provider`)
    }
    this.datasources[name] = datasource
  }

  buildJobs () {
    this.jobs = this.getWidgets().map((widget) => {
      const job = widget.getJob()
      if (job) {
        let executeJob = this.emitResult.bind(this, widget, this.emitter)
        executeJob()
        return setInterval(executeJob, job.schedule)
      }
    })
  }

  emitResult (widget, emitter) {
    return widget.getJob().script().then((result) => {
      result._updated = new Date().toLocaleTimeString()
      emitter.emit(`${widget.id}:update`, result)
    })
    .catch((err) => {
      console.error(`Error in widget ${widget.descriptor} (${widget.id})`, err)
      emitter.emit(widget.id, { error: { message: (err && err.message) || 'An unknown error occured' } })
    })
  }

  toRenderModel () {
    return {
      name: this.name,
      widgets: this.getWidgets().map((widget) => {
        return widget.toRenderModel()
      })
    }
  }

}

module.exports = Dashboard
