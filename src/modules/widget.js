'use strict'

const Path = require('path')
const fs = require('fs')
const id = require('./id-gen')
const markupBuilder = require('./markup-builder')
const AssetReader = require('./asset-reader')
const WidgetPosition = require('./css-builder/widget-position')
const cssBuilder = require('./css-builder')

class Widget {

  constructor (dashboard, renderOptions, descriptor, options) {
    this.dashboard = dashboard
    this.background = renderOptions.background
    this.position = new WidgetPosition(dashboard.layout, renderOptions.position)
    this.id = id()
    
    const paths = this._resolve(descriptor)
    this.assetReader = new AssetReader(paths.base)

    const buildable = new paths.Module().register(
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
    this.markup = this.assetReader.readFromFile(module.markup, '')
    this.clientJs = this.assetReader.readFromFile(module.clientJs, '')

    const providedCss = this.assetReader.readFromFile(module.css, '')
    this.css = cssBuilder.build(this.id, providedCss, this.position, this.background)

    this.update = this.assetReader.readFromFile(module.update, null)
    this.job = { script: module.job, schedule: module.schedule }
    this.config = module.config || {}
  }

  _buildEvent () {
    if (!this.update) { return '' }
    const id = this.id
    return `
      socket.on('${id}:update', function($id, $widget, $data) {
        if ($data.error) {
          console.error('Widget "${id}" encountered error: ' + $data.error.message);
        }
        ${this.update}
      }.bind(this, '${id}', widget_${id}));
    `.trim()
  }

  getMarkup () {
    return markupBuilder.render(this)
  }

  _buildClientJs () {
    if (!this.clientJs) { return '' }
    const id = this.id
    return `
      (function($id, $widget) {
        ${this.clientJs}
      }('${this.id}', widget_${id}));
    `.trim()
  }

  getJs () {
    return `
      var widget_${this.id} = { config: ${JSON.stringify(this.getConfig())} };

      ${this._buildEvent()}

      ${this._buildClientJs()}
    `.trim()
  }

  getCss () {
    return this.css
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
      js: this.getJs(),
      css: this.getCss(),
      markup: this.getMarkup()
    }
  }

}

module.exports = Widget
