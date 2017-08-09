'use strict'

require('app-module-path/cwd')

module.exports.resolve = moduleName => {
  return require(moduleName)
}
