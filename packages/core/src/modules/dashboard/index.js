'use strict'

const { reach } = require('hoek')
const Emitter = require('../emitter')
const id = require('../id-gen')
const parser = require('./parser')
const datasourceLoader = require('../datasource-loader')
const widgetBinder = require('../widget-binder')
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
    const datasources = reach(this, 'descriptor.datasources', { default: {} })
    const hasDatasources = Object.keys(datasources).length
    this.datasources = hasDatasources ? datasourceLoader.load(datasources) : {}
  }

  loadWidgets () {
    const widgets = reach(this, 'descriptor.widgets', { default: [] })
    const hasWidgets = Object.keys(widgets).length
    this.widgets = hasWidgets ? widgetBinder.load(this, widgets, this.datasources) : {}
  }

  destroy () {
    const datasources = this.datasources
    console.log(`Dashboard ${this.id} cleaning up ${datasources.length} datasources.`)
    datasources.forEach(datasource => {
      clearInterval(datasource.timer)
    })
  }

  toRenderModel () {
    const model = {
      name: this.name,
      widgets: this.widgets.map((widget) => {
        return widget.toRenderModel(this.layout)
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
