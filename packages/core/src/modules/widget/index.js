'use strict'

const id = require('../id-gen')
const WidgetPosition = require('./widget-position')
const loader = require('./loader')
const renderer = require('./renderer')
const datasourceLoader = require('./datasource-loader')

class Widget {

  constructor (dashboard, widgetConfig, widgetName, options = {}) {
    this.id = id()
    this.datasource = datasourceLoader.load(widgetName, dashboard, widgetConfig.datasource)
    this.dashboard = dashboard
    this.background = widgetConfig.background
    this.position = new WidgetPosition(dashboard.layout, widgetConfig.position)
    this.config = options

    const { Module, name, component } = loader.load(widgetName)
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
    const { 
      id, 
      name, 
      config, 
      componentPath,
      position,
      background
    } = this
    
    return {
      id,
      name,
      componentPath,
      markup: renderer.renderHtml(id),
      css: renderer.renderStyles(id, position, background),
      js: renderer.renderScript(id, name, config)
    }
  }

}

module.exports = Widget
