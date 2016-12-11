'use strict'

const svelte = require('svelte')

class SvelteCompiler {
  compile (name, html) {
    try {
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
    } catch (err) {
      console.log('Svelte compilation error', err, err.frame)
    }
  }
}

module.exports = new SvelteCompiler()
