'use strict'

const { reach } = require('hoek')
const Path = require('path')
const fs = require('fs')
const upperCamelCase = require('uppercamelcase')
const { ComponentCompilationError } = require('../../errors')
const directoryResolver = require('./directory-resolver')

class Internals {
  optionallyRead (directory, filename) {
    if (!filename) { return '' }
    return fs.readFileSync(Path.join(directory, filename))
  }

  compileLibraries (assetType, pkg, directory) {
    const libs = reach(pkg, `libs.${assetType}`, { default: [] })
    return libs.map((lib) => {
      return this.optionallyRead(directory, lib)
    }).join('\n')
  }
}

class ModuleResolver {

  constructor () {
    this.internals = new Internals()
  }

  readPackage (directory) {
    const packageJson = fs.readFileSync(Path.join(directory, 'package.json'))
    const pkg = JSON.parse(packageJson.toString())

    const html = this.isSingleFileComponent(pkg)
      ? this.buildSingleFileComponent(directory, pkg.vudash)
      : this.buildMultiFileComponent(directory, pkg.vudash)

    const name = upperCamelCase(pkg.name)
    const Module = require(directory)

    const js = this.internals.compileLibraries('js', pkg.vudash, directory)
    const css = this.internals.compileLibraries('css', pkg.vudash, directory)

    return { name, html, Module, js, css }
  }

  resolve (descriptor) {
    if (typeof descriptor === 'object') { return descriptor }
    const directory = directoryResolver.resolve(descriptor)
    return this.readPackage(directory)
  }

  isSingleFileComponent (pkg) {
    const paths = pkg.vudash
    if (!paths) {
      throw new ComponentCompilationError(`Unable to compile component ${pkg.name} as it is missing 'vudash' configuration in package.json`)
    }
    return !!paths.component
  }

  buildMultiFileComponent (directory, paths) {
    const script = this.internals.optionallyRead(directory, paths.script)
    const markup = this.internals.optionallyRead(directory, paths.markup)
    const styles = this.internals.optionallyRead(directory, paths.styles)

    return `${markup} <style>${styles}</style> <script>${script}</script>`
  }

  buildSingleFileComponent (directory, paths) {
    return fs.readFileSync(Path.join(directory, paths.component)).toString()
  }
}

module.exports = new ModuleResolver()
