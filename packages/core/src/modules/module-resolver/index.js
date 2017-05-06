'use strict'

const Path = require('path')
const directoryResolver = require('./directory-resolver')
const { sanitizeComponentName } = require('./component-namer')

function readPackage (directory) {
  const packageJson = require(resolveModuleDependency(directory, 'package.json'))
  const Module = require(directory)
  const component = resolveModuleDependency(directory, packageJson.vudash.component)
  const name = sanitizeComponentName(packageJson.name)
  return { Module, name, component }
}

function resolveModuleDependency (directory, file) {
  return Path.join(directory, file)
}

exports.resolve = function (descriptor) {
  if (typeof descriptor === 'object') { return descriptor }
  const directory = directoryResolver.resolve(descriptor)
  return readPackage(directory)
}
