'use strict'

const svelte = require('svelte')
const fs = require('fs')
const Path = require('path')
const upperCamelCase = require('uppercamelcase')

const Internals = class {
  buildPackage (directory) {
    const packageJson = fs.readFileSync(Path.join(directory, 'package.json'))
    const pkg = JSON.parse(packageJson)
    const paths = pkg.vudash

    const html = paths.component ? 
      this.buildSingleFileComponent(directory, paths) :
      this.buildMultiFileComponent(directory, paths)

    const name = upperCamelCase(pkg.name)

    return { name, html }
  }

  buildMultiFileComponent (directory, paths) {
    const script = fs.readFileSync(Path.join(directory, paths.script))
    const markup = fs.readFileSync(Path.join(directory, paths.markup))
    const styles = fs.readFileSync(Path.join(directory, paths.styles))

    return`${markup} <style>${styles}</style> <script>${script}</script>` 
  }

  buildSingleFileComponent (directory, paths) {
    return fs.readFileSync(Path.join(directory, paths.component))
  }
}

class SvelteCompiler {
  constructor() {
    this.internals = new Internals()
  }

  compile (directory) {
    const { name, html } = this.internals.buildPackage(directory)
    const { code, map } = svelte.compile( html, {
      format: 'iife',
      name,
      onerror: (err) => {
          console.error( err.message )
      },
      onwarning: (warning) => {
          console.warn( warning.message )
      }
    })

    return { code, map, name }
  }
}

module.exports = new SvelteCompiler()