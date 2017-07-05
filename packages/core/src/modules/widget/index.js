'use strict'

const id = require('../id-gen')
const markupRenderer = require('./markup-renderer')
const WidgetPosition = require('./widget-position')
const resolver = require('./resolver')
const layoutStyleRenderer = require('./layout-style-renderer')
const componentRenderer = require('./component-renderer')
const datasourceLoader = require('./datasource-loader')

class Widget {

  constructor (dashboard, widgetConfig, widgetName, options = {}) {
    this.id = id()
    this.datasource = datasourceLoader.load(widgetName, dashboard, widgetConfig.datasource)
    this.dashboard = dashboard
    this.background = widgetConfig.background
    this.position = new WidgetPosition(dashboard.layout, widgetConfig.position)
    this.config = options

    const { Module, name, component } = resolver.resolve(widgetName)
    this.componentPath = component
    this.name = name

    const buildable = new Module().register(
      options,
      this.dashboard.emitter.emit.bind(this.dashboard.emitter),
      this.datasource
    )
    this.build(buildable)
  }

  build (module) {
    this.css = layoutStyleRenderer.render(this.id, this.position, this.background)
    this.job = { script: module.job, schedule: module.schedule }
    this.config = module.config || {}
  }

  getJob () {
    return this.job
  }

  getDatasource () {
    return this.datasource
  }

  getConfig () {
    return this.config
  }

  toRenderModel () {
    return {
      id: this.id,
      name: this.name,
      markup: markupRenderer.render(this),
      css: this.css,
      js: componentRenderer.render(this.id, this.name, this.config),
      componentPath: this.componentPath
    }
  }

}

module.exports = Widget
