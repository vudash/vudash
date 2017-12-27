'use strict'

const Widget = require('../widget')
const EventEmitter = require('events')
const widgetDatasourceBinding = require('../widget-datasource-binding')

function fetchDatasource (datasources, datasourceId) {
  const loopbackDatasource = {
    emitter: new EventEmitter()
  }

  return datasources[datasourceId] || loopbackDatasource
}

exports.load = function (dashboard, widgets = [], datasources = {}) {
  return widgets.reduce((curr, descriptor) => {
    const {
      position,
      background,
      datasource: datasourceId,
      widget: widgetPath,
      options
    } = descriptor

    const widget = Widget.create(widgetPath, { position, background, options })

    const datasource = fetchDatasource(datasources, datasourceId)
    widget.register(datasource.emitter)

    widgetDatasourceBinding.bindEvent(dashboard, widget, datasource, [])

    datasource.emitter.on('plugin', (eventName, data) => {
      dashboard.emit(eventName, data)
    })

    curr[widget.id] = widget
    return curr
  }, {})
}
