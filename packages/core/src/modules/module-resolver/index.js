'use strict'

const { reach } = require('hoek')
const { ConfigurationError } = require('../../errors')
const { join } = require('path')
const { existsSync } = require('fs')
const directoryResolver = require('./directory-resolver')
const { upperCamel } = require('../upper-camel')

function readPackage (directory) {
  const packageJson = require(resolveModuleDependency(directory, 'package.json'))
  const Module = require(directory)
  const componentPath = resolveComponent(directory, packageJson)
  const name = upperCamel(packageJson.name)
  return { Module, name, component: componentPath }
}

function resolveModuleDependency (directory, file) {
  return join(directory, file)
}

function resolveComponent (directory, packageJson) {
  const componentHtml = readComponentStanza(packageJson)
  const location = resolveModuleDependency(directory, componentHtml)
  if (!existsSync(location)) {
    const packageName = reach(packageJson, 'name')
    throw new ConfigurationError(`Module dependency ${location} declared in component ${packageName} does not exist`)
  }
  return location
}

function readComponentStanza (packageJson) {
  const path = 'vudash.component'
  const componentPath = reach(packageJson, path)
  if (!componentPath) {
    const packageName = reach(packageJson, 'name')
    throw new ConfigurationError(`Component ${packageName} is missing '${path}' in package.json`)
  }
  return componentPath
}

exports.resolve = function (descriptor) {
  if (typeof descriptor === 'object') { return descriptor }
  const directory = directoryResolver.resolve(descriptor)
  return readPackage(directory)
}
