'use strict'

const Path = require('path')
const fs = require('fs')

class Widget {

  constructor(path) {
    if (!fs.existsSync(path)) { throw new Error(`Could not load widget from ${path}`)}
    const descriptor = require(Path.join(path, 'descriptor.json'))
    this.markup = fs.readFileSync(Path.join(path, descriptor.markup), 'utf-8').trim()
  }

  getMarkup() {
    return this.markup
  }

}

module.exports = Widget
