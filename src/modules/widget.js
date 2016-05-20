'use strict'

const Path = require('path')
const fs = require('fs')
const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_')

class Widget {

  constructor(path) {
    this.path = Path.join(process.cwd(), path)
    const descriptor = this._loadDefinition(this.path)
    this.id = shortid.generate()
    this.markup = this._fetchInternal(descriptor.markup)
    this.js = this._fetchInternal(descriptor.js)
    this.css = this._fetchInternal(descriptor.css)
    this.update = this._fetchInternal(descriptor.update)
  }

  _loadDefinition(path) {
    if (!fs.existsSync(path)) { throw new Error(`Could not load widget from ${path}`) }
    return require(Path.join(path, 'descriptor.json'))
  }

  _fetchInternal(definition) {
    if (!definition) { return '' }
    const location = Path.join(this.path, definition)
    if (!fs.existsSync(location)) { throw new Error(`Could not load widget component from ${location}`) }
    return fs.readFileSync(location, 'utf-8').trim()
  }

  _buildEvent() {
    const id = this.id
    return `
    var widget_${id} = function() {}
    widget_${id}.prototype.update = function(data) {
      ${this.update}
    };
    socket.on('${id}:update', widget_${id}.update);
    `.trim()
  }

  getMarkup() {
    return this.markup
  }

  getJs() {
    return `
      ${this._buildEvent()}
      ${this.js}
    `.trim()
  }

  getCss() {
    return this.css
  }

  toRenderModel() {
    return {
      js: this.getJs(),
      css: this.getCss(),
      markup: this.getMarkup()
    }
  }

}

module.exports = Widget
