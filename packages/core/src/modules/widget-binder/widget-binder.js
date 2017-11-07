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

function bindDatasourceEmitter (widget, datasources, datasource, dashboard) {
  const datasourceEmitter = reach(datasources, `${datasource}.emitter`)
  if (datasourceEmitter) {
    datasourceEmitter.on('update', value => {
      const data = buildUpdate(widget.update(value))
      dashboard.emit(`${widget.id}:update`, data)
    })
  }
}

exports.load = function (dashboard, widgets = [], datasources = {}) {
  return widgets.reduce((curr, descriptor) => {
    const { position, background, datasource, widget: widgetPath, options } = descriptor
    const widgetEmitter = new EventEmitter()

    const widget = Widget.create(widgetPath, { position, background, options })
    widget.register(widgetEmitter)

    bindDatasourceEmitter(widget, datasources, datasource, dashboard)

    widgetEmitter.on('update', value => {
      const data = buildUpdate(value)
      dashboard.emit(`${widget.id}:update`, data)
    })

    widgetEmitter.on('plugin', (eventName, data) => {
      dashboard.emit(eventName, data)
    })

    curr[widget.id] = widget
    return curr
  }, {})
}
