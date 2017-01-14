'use strict'

const Path = require('path')

class DirectoryResolver {
  resolve (module) {
    let entry
    try {
      entry = require.resolve(module)
    } catch (e) {
      const local = Path.join(process.cwd(), module)
      entry = require.resolve(local)
    }

    return Path.dirname(entry)
  }
}

module.exports = new DirectoryResolver()
