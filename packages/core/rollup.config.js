'use strict'

import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'input.js',
  dest: 'bundle.js',
  format: 'iife',
  plugins: [
    commonjs(),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    svelte({})
  ]
}
