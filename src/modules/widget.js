'use strict'

const Path = require('path')
const fs = require('fs')
const Handlebars = require('handlebars')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_')

class Widget {

  constructor (path, options) {
    this.id = shortid.generate()
    const location = Path.join(process.cwd(), path)
    const Module = require(location)
    this.base = Path.dirname(require.resolve(location))
    const module = new Module().register(options)
    this.build(module)
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
