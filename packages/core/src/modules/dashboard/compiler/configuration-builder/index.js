'use strict'

const svelte = require('rollup-plugin-svelte')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const memory = require('rollup-plugin-memory')
const css = require('rollup-plugin-postcss')
const svg = require('rollup-plugin-svg')

exports.build = function (source) {
  return {
    entry: {
      path: 'dashboard.js',
      contents: source
    },
    dest: 'bundle.js',
    format: 'iife',
    plugins: [
      svg(),
      memory(),
      commonjs(),
      resolve({
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      css(),
      svelte()
    ]
  }
}
