'use strict'

const Path = require('path')
const fs = require('fs')
const id = require('./id-gen')
const markupBuilder = require('./markup-builder')
const svelteCompiler = require('./svelte-compiler')
const WidgetPosition = require('./css-builder/widget-position')
const cssBuilder = require('./css-builder')

class Widget {

  constructor (dashboard, renderOptions, descriptor, options) {
    this.dashboard = dashboard
    this.background = renderOptions.background
    this.position = new WidgetPosition(dashboard.layout, renderOptions.position)
    this.id = id()

    const { base, Module } = this._resolve(descriptor)

    this.component = svelteCompiler.compile(base)
    console.log(this.component)

    const buildable = new Module().register(
      options,
      this.dashboard.emitter.emit.bind(this.dashboard.emitter)
    )
    this.build(buildable)
  }

  _resolve (module) {
    if (typeof module === 'function') {
      return { base: process.cwd(), Module: module }
    }

    let entry
    try {
      entry = require.resolve(module)
    } catch (e) {
      const local = Path.join(process.cwd(), module)
      entry = require.resolve(local)
    }

    return {
      Module: require(entry),
      base: Path.dirname(entry)
    }
  }

  build (module) {
    this.css = cssBuilder.build(this.id, '', this.position, this.background)

    this.job = { script: module.job, schedule: module.schedule }
    this.config = module.config || {}
  }

  getJs () {
    const id = this.id

    return `
      ${this.component.code}

      var widget_${this.id} = new ${this.component.name}({ target: document.getElementById("widget-container-${this.id}") });

      socket.on('${id}:update', function($id, $widget, $data) {
        if ($data.error) {
          console.error('Widget "${id}" encountered error: ' + $data.error.message);
        }
        widget_${this.id}.update($data);
      }.bind(this, '${id}', widget_${id}));
    `.trim()
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
      js: this.getJs()
    }
  }

}

module.exports = Widget
