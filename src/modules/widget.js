'use strict'

const id = require('./id-gen')
const markupBuilder = require('./markup-builder')
const svelteCompiler = require('./svelte-compiler')
const WidgetPosition = require('./css-builder/widget-position')
const moduleResolver = require('./module-resolver')
const cssBuilder = require('./css-builder')
const componentRenderer = require('./component-renderer')

class Widget {

  constructor (dashboard, renderOptions, descriptor, options) {
    this.dashboard = dashboard
    this.background = renderOptions.background
    this.position = new WidgetPosition(dashboard.layout, renderOptions.position)
    this.id = id()

    const { name, html, Module } = moduleResolver.resolve(descriptor)

    this.component = svelteCompiler.compile(name, html)

    const buildable = new Module().register(
      options,
      this.dashboard.emitter.emit.bind(this.dashboard.emitter)
    )
    this.build(buildable)
  }

  build (module) {
    this.css = cssBuilder.build(this.id, '', this.position, this.background)

    this.job = { script: module.job, schedule: module.schedule }
    this.config = module.config || {}
  }

  getJob () {
    return this.job
  }

  getConfig () {
    return this.config
  }

  toRenderModel () {
    return {
      id: this.id,
      markup: markupBuilder.render(this),
      css: this.css,
      js: componentRenderer.render(this.id, this.component)
    }
  }

}

module.exports = Widget
