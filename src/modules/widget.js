'use strict'

const Path = require('path')
const fs = require('fs')
const shortid = require('shortid')

class Widget {

  constructor(path) {
    this.path = Path.join(process.cwd(), path)
    const descriptor = this._loadDefinition(this.path)
    this.id = shortid.generate()
    this.markup = this._fetchInternal(descriptor.markup)
    this.js = this._fetchInternal(descriptor.js)
    this.css = this._fetchInternal(descriptor.css)
    this.events = this._bindEvents(descriptor.events)
  }

  _loadDefinition(path) {
    if (!fs.existsSync(path)) { throw new Error(`Could not load widget from ${path}`) }
    return require(Path.join(path, 'descriptor.json'))
  }

  _bindEvents(events) {
    let bound = {}
    if (events) {
      for (let event of Object.keys(events)) {
        bound[`${this.id}:${event}`] = events[event]
      }
    }
    return bound
  }

  _fetchInternal(definition) {
    if (!definition) { return '' }
    const location = Path.join(this.path, definition)
    if (!fs.existsSync(location)) { throw new Error(`Could not load widget component from ${location}`) }
    return fs.readFileSync(location, 'utf-8').trim()
  }

  getMarkup() {
    return this.markup
  }

  getJs() {
    return this.js
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
