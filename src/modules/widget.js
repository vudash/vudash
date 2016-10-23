'use strict'

const Path = require('path')
const fs = require('fs')
const Handlebars = require('handlebars')
const id = require('./id-gen')

class Widget {

  constructor (dashboard, position, descriptor, options) {
    this.dashboard = dashboard
    this.position = position
    this.id = id()
    const paths = this._resolve(descriptor)
    this.base = paths.base
    const buildable = new paths.Module().register(options)
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
    this.markup = this._readFile(module.markup, '')
    this.clientJs = this._readFile(module.clientJs, '')
    this.css = this._readFile(module.css, '')
    this.update = this._readFile(module.update, null)
    this.job = { script: module.job, schedule: module.schedule }
    this.config = module.config || {}
  }

  _readFile (definition, defaultValue) {
    if (!definition) { return defaultValue }
    if (Array.isArray(definition)) {
      return definition.map((file) => {
        return this._readFile(file)
      }).join('\n')
    }

    const file = Path.join(this.base, definition)
    if (!fs.existsSync(file)) { throw new Error(`Could not load widget component from ${file}`) }
    return fs.readFileSync(file, 'utf-8').trim()
  }

  _buildEvent () {
    if (!this.update) { return '' }
    const id = this.id
    return `
      socket.on('${id}:update', function($id, $widget, $data) {
        if ($data.error) {
          console.error('Widget "$id" encountered error: ' + $data.error);
        }
        ${this.update}
      }.bind(this, '${id}', widget_${id}));
    `.trim()
  }

  get rowHeight () {
    return 100 / this.dashboard.layout.rows
  }

  get columnWidth () {
    return 100 / this.dashboard.layout.columns
  }

  get height () {
    return this.position.h * this.rowHeight
  }

  get width () {
    return this.position.w * this.columnWidth
  }

  get left () {
    return this.position.x * this.columnWidth
  }

  get top () {
    return this.position.y * this.rowHeight
  }

  getMarkup () {
    const template = Handlebars.compile(this.markup)
    return `<div class="widget-container" style="top: ${this.top}%; left: ${this.left}%; width: ${this.width}%; height: ${this.height}%">${template(this)}</div>`
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
