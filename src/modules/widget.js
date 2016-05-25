'use strict'

const Path = require('path')
const fs = require('fs')
const Handlebars = require('handlebars')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_')

const widths = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen'
}

class Widget {

  constructor (path, options) {
    this.path = Path.join(process.cwd(), path)
    const descriptor = this._loadDefinition(this.path)
    this.id = shortid.generate()
    this.markup = this._readFile(descriptor.markup, '')
    this.clientsideJs = this._readFile(descriptor.clientsideJs, '')
    this.css = this._readFile(descriptor.css, '')
    this.update = this._readFile(descriptor.update, null)
    this.width = descriptor.width || 4
    this.job = this._loadJob(descriptor.job, options)
  }

  _loadJob (job, options) {
    let definition = Object.assign({}, this._requireFile(job, {}))
    if (options) {
      definition.config = Object.assign({}, definition.config, options)
    }
    return definition
  }

  _loadDefinition (path) {
    if (!fs.existsSync(path)) { throw new Error(`Could not load widget from ${path}`) }
    return require(Path.join(path, 'descriptor.json'))
  }

  _determineLocation (definition) {
    const location = Path.join(this.path, definition)
    if (!fs.existsSync(location)) { throw new Error(`Could not load widget component from ${location}`) }
    return location
  }

  _requireFile (definition, defaultValue) {
    if (!definition) { return defaultValue }
    const file = this._determineLocation(definition)
    return require(file)
  }

  _readFile (definition, defaultValue) {
    if (!definition) { return defaultValue }
    const file = this._determineLocation(definition)
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

  getWidth () {
    return widths[this.width]
  }

  toRenderModel () {
    return {
      js: this.getClientsideJs(),
      css: this.getCss(),
      markup: this.getMarkup(),
      width: this.getWidth()
    }
  }

}

module.exports = Widget
