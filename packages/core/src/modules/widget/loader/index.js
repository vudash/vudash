'use strict'

const { reach } = require('hoek')
const { join } = require('path')
const resolver = require('../../resolver')
const { upperCamel } = require('../../upper-camel')
const { ConfigurationError } = require('../../../errors')
const slash = require('slash')
const findRoot = require('find-root')

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

function findPackageRoot (directory) {
  const moduleEntrypoint = resolver.discover(directory)
  return findRoot(moduleEntrypoint)
}

function loadPackageJson (packageRoot) {
  return require(join(packageRoot, 'package.json'))
}

function readPackage (directory) {
  const packageRoot = findPackageRoot(directory)
  const widget = require(packageRoot)
  const packageJson = loadPackageJson(packageRoot)
  const componentPath = discoverComponentPath(packageRoot, packageJson)

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

exports.load = function (pathOrDescriptor) {
  const isPreParsed = typeof pathOrDescriptor === 'object'
  if (isPreParsed) {
    return pathOrDescriptor
  }
  return readPackage(pathOrDescriptor)
}
