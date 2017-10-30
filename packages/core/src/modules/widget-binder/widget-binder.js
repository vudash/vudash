'use strict'

const Widget = require('../widget')
const EventEmitter = require('events')
const { reach } = require('hoek')

function buildUpdate (data) {
  return {
    meta: {
      updated: new Date()
    },
    data
  }
}

function bindDatasourceEmitter (widget, datasources, datasource, dashboardEmitter) {
  const datasourceEmitter = reach(datasources, `${datasource}.emitter`)
  if (datasourceEmitter) {
    datasourceEmitter.on('update', value => {
      const data = buildUpdate(widget.update(value))
      dashboardEmitter.emit(`${widget.id}:update`, data)
    })
  }
}

exports.load = function (dashboard, widgets = [], datasources = {}) {
  return widgets.map(descriptor => {
    const { position, background, datasource, widget: widgetPath, options } = descriptor
    const dashboardEmitter = dashboard.emitter
    const widgetEmitter = new EventEmitter()

    const widget = Widget.create(widgetPath, { position, background, options })
    widget.register(widgetEmitter)

    bindDatasourceEmitter(widget, datasources, datasource, dashboardEmitter)

    widgetEmitter.on('update', value => {
      const data = buildUpdate(value)
      dashboardEmitter.emit(`${widget.id}:update`, data)
    })

    widgetEmitter.on('plugin', (eventName, data) => {
      dashboardEmitter.emit(eventName, data)
    })

    return widget
  })
}
