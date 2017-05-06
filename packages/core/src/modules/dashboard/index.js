'use strict'

const Emitter = require('../emitter')
const id = require('../id-gen')
const descriptorParser = require('../descriptor-parser')
const assetBuilder = require('../asset-builder')
const Widget = require('../widget')
const PluginLoader = require('./plugin-loader')
const bundleBuilder = require('./bundle-builder')
const bundleCompiler = require('./bundle-compiler')

class Dashboard {
  constructor (json, io) {
    const descriptor = descriptorParser.parse(json)

    this.id = id()
    this.name = descriptor.name
    this.assets = assetBuilder.build(descriptor.assets)
    this.emitter = new Emitter(io, this.id)
    this.layout = descriptor.layout

    this.datasources = {}

    const pluginIds = descriptor.plugins && Object.keys(descriptor.plugins)
    if (pluginIds) {
      pluginIds.forEach((id) => {
        const pluginConfig = descriptor.plugins[id]
        const pluginLoader = new PluginLoader(id, this)
        pluginLoader.load(pluginConfig)
      })
    }

    this.widgets = descriptor.widgets.map(({ position, background, datasource, widget, options }) => {
      return new Widget(this, {
        position: position,
        background: background,
        datasource: datasource
      }, widget, options)
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
      emitter = null
    })
    .catch((err) => {
      console.error(`Error in widget ${widget.descriptor} (${widget.id})`, err)
      emitter.emit(widget.id, { error: { message: (err && err.message) || 'An unknown error occured' } })
      emitter = null
    })
  }

  toRenderModel () {
    const model = {
      name: this.name,
      widgets: this.getWidgets().map((widget) => {
        return widget.toRenderModel()
      })
    }

    const bundle = bundleBuilder.build(model.widgets)

    return bundleCompiler.compile(bundle.js)
    .then(({ js, css }) => {
      const allCss = `${css}\n${bundle.css}`
      return { html: bundle.html, js, css: allCss, name: model.name }
    })
  }
}

module.exports = Dashboard
