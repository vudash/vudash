'use strict'

const Path = require('path')
const fs = require('fs')

class AssetReader {
  constructor (base) {
    this.base = base
  }

  readFromFile (definition, defaultValue) {
    if (!definition) { return defaultValue }
    if (Array.isArray(definition)) {
      return definition.map((file) => {
        return this.readFromFile(file)
      }).join('\n')
    }

    const file = Path.join(this.base, definition)
    if (!fs.existsSync(file)) { throw new Error(`Could not load widget component from ${file}`) }
    return fs.readFileSync(file, 'utf-8').trim()
  }
}

module.exports = AssetReader