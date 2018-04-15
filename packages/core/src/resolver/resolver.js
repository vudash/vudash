'use strict'

const fs = require('fs')
const { join } = require('path')

function discoverNpmModule (moduleName) {
  try {
    return require.resolve(moduleName)
  } catch (e) {
    return null
  }
}

function discoverLocalModule (moduleName) {
  const path = join(process.cwd(), moduleName)
  return fs.existsSync(path) ? path : null
}

function throwNotFound (moduleName) {
  throw new Error(`Module ${moduleName} could not be resolved as an NPM module or a local module`)
}

function discover (moduleName) {
  return [
    discoverNpmModule,
    discoverLocalModule,
    throwNotFound
  ].find(method => {
    return method(moduleName)
  })(moduleName)
}

function resolve (moduleName) {
  return require(discover(moduleName))
}

module.exports = {
  discover,
  resolve
}
