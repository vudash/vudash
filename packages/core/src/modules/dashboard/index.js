'use strict'

const Css = require('json-to-css')
const { reach } = require('hoek')
const Emitter = require('./emitter')
const id = require('../id-gen')
const parser = require('./parser')
const datasourceLoader = require('../datasource-loader')
const widgetBinder = require('../widget-binder')
const renderer = require('./renderer')

function isWidgetEvent (eventId) {
  return eventId.endsWith(':update')
}

class Dashboard {
  constructor (json, io) {
    const descriptor = parser.parse(json)
    const { name, layout, css } = descriptor

    this.id = id()
    this.name = name
    this.additionalCss = css || {}
    this.emitter = new Emitter(io, this.id)
    this.layout = layout

    this.descriptor = descriptor
  }

  emit (eventId, data, historical) {
    if (!isWidgetEvent(eventId)) {
      return this.emitter.emit(eventId, data, historical)
    }

    const widgetId = eventId.split(':')[0]
    const widget = this.widgets[widgetId]

    if (!historical && widget) {
      widget.history.insert(data)
    }

    const history = widget ? widget.history.fetch() : {}
    const update = Object.assign({ history }, data)
    this.emitter.emit(eventId, update, historical)
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

  compileAdditionalCss () {
    return Css.of(this.additionalCss)
  }

  toRenderModel () {
    const model = renderer.buildRenderModel(
      this.name, this.widgets, this.layout
    )

    model.css = this.compileAdditionalCss()
    return model
  }
}

exports.create = function (descriptor, io) {
  return new Dashboard(descriptor, io)
}
