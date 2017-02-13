'use strict'

const id = require('../id-gen')
const markupBuilder = require('../markup-builder')
const svelteCompiler = require('../svelte-compiler')
const WidgetPosition = require('../css-builder/widget-position')
const moduleResolver = require('../module-resolver')
const cssBuilder = require('../css-builder')
const componentRenderer = require('../component-renderer')
const datasourceResolver = require('./datasource-resolver')

class Widget {

  constructor (dashboard, renderOptions, moduleName, options = {}) {
    this.dashboard = dashboard
    this.background = renderOptions.background
    this.position = new WidgetPosition(dashboard.layout, renderOptions.position)
    this.id = id()
    this.config = options

    const { name, html, Module, js, css } = moduleResolver.resolve(moduleName)
    this.providedCss = css
    this.providedJs = js

    this.component = svelteCompiler.compile(name, html)
    this.datasource = datasourceResolver.resolve(dashboard.datasources, options.datasource)

    const buildable = new Module().register(
      options,
      this.dashboard.emitter.emit.bind(this.dashboard.emitter)
    )
    this.build(buildable)
  }

  build (module) {
    this.css = cssBuilder.build(this.id, this.position, this.background)
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
      markup: markupBuilder.render(this),
      css: this.css,
      js: componentRenderer.render(this.id, this.component, this.config),
      providedJs: this.providedJs,
      providedCss: this.providedCss
    }
  }

}

module.exports = Widget
