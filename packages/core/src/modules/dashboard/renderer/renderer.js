'use strict'

const bundler = require('../bundler')
const compiler = require('../compiler')

function renderWidgets (widgets, layout) {
  const widgetModel = Object.values(widgets)
  return widgetModel.map(widget => {
    return widget.toRenderModel(layout)
  })
}

exports.buildRenderModel = async function (name, widgets, layout) {
  const renderedWidgets = renderWidgets(widgets, layout)
  const { js, html } = bundler.build(renderedWidgets)

  const script = await compiler.compile(js)

  return {
    name,
    html,
    js: script
  }
}
