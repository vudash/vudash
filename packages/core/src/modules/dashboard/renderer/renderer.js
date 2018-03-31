'use strict'

const bundler = require('../bundler')
const compiler = require('../compiler')
const Css = require('json-to-css')

function renderWidgets (widgets, layout) {
  const widgetModel = Object.values(widgets)
  return widgetModel.map(widget => {
    return widget.toRenderModel(layout)
  })
}

exports.buildRenderModel = async function (name, widgets, layout) {
  const renderedWidgets = renderWidgets(widgets, layout)
  const app = bundler.build(renderedWidgets)

  const script = await compiler.compile(app)

  return {
    name,
    app
  }
}

exports.compileAdditionalCss = function (css) {
  return Css.of(css)
}