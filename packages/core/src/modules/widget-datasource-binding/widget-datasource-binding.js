'use strict'

const dashboardEvent = require('../dashboard-event')

function transform (data, transformers) {
  return transformers.reduce((current, next) => {
    return next.transform(data)
  }, {})
}

exports.bindEvent = function (dashboard, widget, datasource, transformers) {
  if (!datasource) {
    return
  }

  datasource.emitter.on('update', value => {
    const event = `${widget.id}:update`
    const hasTransformers = transformers && transformers.length

    const data = widget.update(value)
    const transformed = hasTransformers ? transform(data, transformers) : data
    const payload = dashboardEvent.build(transformed)
    dashboard.emit(event, payload)
  })
}
