'use strict'

const svelte = require('svelte')
const buble = require('buble')

class SvelteCompiler {

  compile (name, html) {
    try {
      const { code } = svelte.compile(html, {
        format: 'iife',
        name,
        onerror: (err) => {
          console.error(err.message)
        },
        onwarning: (warning) => {
          console.warn(warning.message)
        }
      })

      const transformed = buble.transform(code)

      return { code: transformed.code, map: transformed.map, name }
    } catch (err) {
      console.log('Svelte compilation error', err, err.frame)
    }
  }
}

module.exports = new SvelteCompiler()
