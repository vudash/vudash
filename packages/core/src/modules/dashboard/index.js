'use strict'

const { reach } = require('hoek')
const Emitter = require('../emitter')
const id = require('../id-gen')
const parser = require('./parser')
const Widget = require('../widget')
const datasourceLoader = require('../datasource-loader')
const bundler = require('./bundler')
const compiler = require('./compiler')

class Dashboard {
  constructor (json, io) {
    const descriptor = parser.parse(json)

    this.id = id()
    this.name = descriptor.name
    this.emitter = new Emitter(io, this.id)
    this.layout = descriptor.layout

    this.descriptor = descriptor
  }

  loadDatasources () {
    const datasources = reach(this, 'descriptor.datasources')
    this.datasources = datasourceLoader.load(datasources)
  }

  loadWidgets () {
    const widgets = reach(this, 'descriptor.widgets')
    this.widgets = widgets.map(descriptor => {
      const { position, background, datasource, widget, options } = descriptor

      return new Widget(this, {
        position,
        background,
        datasource
      }, widget, options)
    })
  }

  destroy () {
    const datasources = this.datasources
    console.log(`Dashboard ${this.id} cleaning up ${datasources.length} datasources.`)
    datasources.forEach(datasource => {
      clearInterval(datasource.timer)
    })
  }

  // TODO: remove
  emitResult (widget, emitter) {
    return widget.job.script().then((result) => {
      result._updated = new Date()
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
      widgets: this.widgets.map((widget) => {
        return widget.toRenderModel()
      })
    }

    const bundle = bundler.build(model.widgets)

    return compiler.compile(bundle.js)
    .then(({ js, css }) => {
      const allCss = `${css}\n${bundle.css}`
      return { html: bundle.html, js, css: allCss, name: model.name }
    })
  }
}

module.exports = Dashboard
