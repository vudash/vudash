'use strict'

const bundler = require('../bundler')
const compiler = require('../compiler')

function renderWidgets (widgets, layout) {
  const widgetModel = Object.values(widgets)
  return widgetModel.map(widget => {
    return widget.toRenderModel(layout)
  })
}

// TODO: why do we do this?
function compileCss (bundleCss, compiledCss) {
  return `${compiledCss}\n${bundleCss}`
}

exports.buildRenderModel = function (name, widgets, layout) {
  const renderedWidgets = renderWidgets(widgets, layout)
  const { js: bundledJs, css, html } = bundler.build(renderedWidgets)

  return compiler.compile(bundledJs)
  .then(({ js, compiledCss }) => {
    return {
      name,
      html,
      js,
      css: compileCss(css, compiledCss)
    }
  })
}
