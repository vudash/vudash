'use strict'

const { reach } = require('hoek')
const { ConfigurationError } = require('../../errors')
const Path = require('path')
const directoryResolver = require('./directory-resolver')
const { upperCamel } = require('../upper-camel')

function readPackage (directory) {
  const packageJson = require(resolveModuleDependency(directory, 'package.json'))
  const Module = require(directory)
  const component = resolveModuleDependency(directory, readComponentStanza(packageJson))
  const name = upperCamel(packageJson.name)
  return { Module, name, component }
}

function resolveModuleDependency (directory, file) {
  return Path.join(directory, file)
}

function readComponentStanza (packageJson) {
  const path = 'vudash.component'
  const componentPath = reach(packageJson, path)
  if (!componentPath) {
    throw new ConfigurationError(`Component ${reach(packageJson, 'name')} is missing '${path}' in package.json`)
  }
  return componentPath
}

exports.resolve = function (descriptor) {
  if (typeof descriptor === 'object') { return descriptor }
  const directory = directoryResolver.resolve(descriptor)
  return readPackage(directory)
}
