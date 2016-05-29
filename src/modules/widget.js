'use strict'

const Path = require('path')
const fs = require('fs')
const Handlebars = require('handlebars')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_')

class Widget {

  constructor (module, options) {
    this.id = shortid.generate()
    const paths = this._resolve(module)
    const Module = require(paths.entry)
    this.base = paths.base
    const widget = new Module().register(options)
    this.build(widget)
  }

  _resolve (module) {
    const paths = {}
    try {
      paths.entry = require.resolve(module)
    } catch (e) {
      const local = Path.join(process.cwd(), module)
      paths.entry = require.resolve(local)
    }
    paths.base = Path.dirname(paths.entry)
    return paths
  }

  build (module) {
    this.markup = this._readFile(module.markup, '')
    this.clientsideJs = this._readFile(module.clientJs, '')
    this.css = this._readFile(module.css, '')
    this.update = this._readFile(module.update, null)
    this.job = { script: module.job, schedule: module.schedule }
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
    var widget_${id} = {
      update: ${this.update},
      handleEvent: function(data) {
        this.update.call(this, '${id}', data)
      }
    }

    socket.on('${id}:update', widget_${id}.handleEvent.bind(widget_${id}))
    `.trim()
  }

  getMarkup () {
    const template = Handlebars.compile(this.markup)
    return template(this)
  }

  getClientsideJs () {
    return `
      ${this._buildEvent()}
      ${this.clientsideJs}
    `.trim()
  }

  getCss () {
    return this.css
  }

  getJob () {
    return this.job
  }

  toRenderModel () {
    return {
      js: this.getClientsideJs(),
      css: this.getCss(),
      markup: this.getMarkup()
    }
  }

}

module.exports = Widget
