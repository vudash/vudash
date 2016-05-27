'use strict'

const Path = require('path')
const fs = require('fs')
const Handlebars = require('handlebars')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_')

class Widget {

  constructor (path, options) {
    this.id = shortid.generate()
    this.path = Path.join(process.cwd(), path)
    const module = this._attemptLoad(this.path, options)
    this.markup = this._readFile(module.markup, '')
    this.clientsideJs = this._readFile(module.clientJs, '')
    this.css = this._readFile(module.css, '')
    this.update = this._readFile(module.update, null)
    this.job = { script: module.job, schedule: module.schedule }
  }

  _attemptLoad (path, options) {
    const location = Path.join(this.path, 'widget.js')
    if (!fs.existsSync(location)) { throw new Error(`Could not load widget from ${location}`) }
    try {
      const Module = require(location)
      return new Module().register(options)
    } catch (err) {
      throw new Error(`Failed to load widget at ${location}`, err)
    }
  }

  _determineLocation (definition) {
    const location = Path.join(this.path, definition)
    if (!fs.existsSync(location)) { throw new Error(`Could not load widget component from ${location}`) }
    return location
  }

  _loadFile (definition) {
    const file = this._determineLocation(definition)
    return fs.readFileSync(file, 'utf-8').trim()
  }

  _readFile (definition, defaultValue) {
    if (!definition) { return defaultValue }
    return this._loadFile(definition)
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
