'use strict'

const svelte = require('svelte')

class SvelteCompiler {
  compile (name, html) {
    const { code, map } = svelte.compile(html, {
      format: 'iife',
      name,
      onerror: (err) => {
        console.error(err.message)
      },
      onwarning: (warning) => {
        console.warn(warning.message)
      }
    })

    return { code, map, name }
  }
}

module.exports = new SvelteCompiler()
