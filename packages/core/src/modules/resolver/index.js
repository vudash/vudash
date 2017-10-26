'use strict'

const fs = require('fs')

function discover (moduleName) {
  const path = require('path').join(process.cwd(), moduleName)
  if (!fs.existsSync(path)) {
    throw new Error(`Module ${moduleName} could not be resolved at ${path}`)
  }
  return path
}

function resolve (moduleName) {
  return require(discover(moduleName))
}

module.exports = {
  discover,
  resolve
}
