'use strict'

const Widget = require('../widget')

exports.load = function (dashboard, widgets = [], datasources = {}) {
  return widgets.map(descriptor => {
    const { position, background, datasource, widget: widgetPath, options } = descriptor
    const datasourceEmitter = datasources[datasource].emitter
    const dashboardEmitter = dashboard.emitter

    const widget = Widget.create(widgetPath, { position, background, options })
    widget.register(dashboardEmitter)

    datasourceEmitter.on('update', value => {
      const data = {
        meta: {
          updated: new Date()
        },
        data: widget.update(value)
      }
      dashboardEmitter.emit(`${widget.id}:update`, data)
    })

    return widget
  })
}
