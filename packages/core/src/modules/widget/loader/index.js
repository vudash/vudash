'use strict'

const { reach } = require('hoek')
const { join } = require('path')
const resolver = require('../../resolver')
const { upperCamel } = require('../../upper-camel')
const { ConfigurationError } = require('../../../errors')
const slash = require('slash')

function discoverComponentPath (packagePath, packageJson) {
  const relativeComponentPath = readComponentStanza(packageJson)
  const absoluteComponentPath = join(packagePath, relativeComponentPath)
  const localPath = slash(absoluteComponentPath)
  if (!localPath) {
    const packageName = reach(packageJson, 'name')
    throw new ConfigurationError(`Cannot find component at ${localPath} for widget ${packageName}.`)
  }
  return localPath
}

function readPackage (directory) {
  const packageBasePath = resolver.discover(directory)
  const widget = require(packageBasePath)
  const packageJson = require(join(packageBasePath, 'package.json'))
  const componentPath = discoverComponentPath(packageBasePath, packageJson)

  const name = upperCamel(packageJson.name)
  return { widget, name, componentPath }
}

function readComponentStanza (packageJson) {
  const path = 'vudash.component'
  const componentPath = reach(packageJson, path)
  if (!componentPath) {
    const packageName = reach(packageJson, 'name')
    throw new ConfigurationError(`Widget ${packageName} is missing '${path}' in package.json`)
  }
  return componentPath
}

exports.load = function (descriptor) {
  if (typeof descriptor === 'object') { return descriptor }
  return readPackage(descriptor)
}
