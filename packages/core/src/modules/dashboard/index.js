'use strict'

const { reach } = require('hoek')
const Emitter = require('../emitter')
const id = require('../id-gen')
const parser = require('./parser')
const datasourceLoader = require('../datasource-loader')
const widgetBinder = require('../widget-binder')
const renderer = require('./renderer')

class Dashboard {
  constructor (json, io) {
    const descriptor = parser.parse(json)
    const { name, layout } = descriptor

    this.id = id()
    this.name = name
    this.emitter = new Emitter(io, this.id)
    this.layout = layout

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
    const datasources = Object.values(this.datasources)
    console.log(`Dashboard ${this.id} cleaning up ${datasources.length} datasources.`)
    datasources.forEach(datasource => {
      clearInterval(datasource.timer)
    })

    const widgets = Object.values(this.widgets)
    console.log(`Dashboard ${this.id} attempting cleanup of ${widgets.length} widgets.`)
    widgets.forEach(widget => {
      widget.hasOwnProperty('destroy') && widget.destroy()
    })
  }

  toRenderModel () {
    const {
      name,
      widgets,
      layout
    } = this

    return renderer.buildRenderModel(name, widgets, layout)
  }
}

exports.create = function (descriptor, io) {
  return new Dashboard(descriptor, io)
}
