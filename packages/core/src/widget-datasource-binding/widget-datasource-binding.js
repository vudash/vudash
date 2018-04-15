'use strict'

const dashboardEvent = require('../dashboard-event')

function transform (data, transformers) {
  return transformers.reduce((current, next) => {
    return next.transform(current)
  }, data)
}

exports.bindEvent = function (dashboard, widget, datasource, transformers) {
  datasource.emitter.on('update', value => {
    const event = `${widget.id}:update`
    const hasTransformers = !!(transformers && transformers.length)
    const transformed = hasTransformers ? transform(value, transformers) : value
    const result = widget.update(transformed)
    const payload = dashboardEvent.build(result)
    dashboard.emit(event, payload)
  })
}
