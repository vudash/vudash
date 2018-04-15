'use strict'

const svelte = require('rollup-plugin-svelte')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const virtual = require('rollup-plugin-virtual')
const css = require('rollup-plugin-postcss')
const svg = require('rollup-plugin-svg')
const buble = require('rollup-plugin-buble')
const uglify = require('rollup-plugin-uglify-es')

exports.build = function (source) {
  const inputConfig = {
    entry: '__input__',
    plugins: [
      svg(),
      virtual({
        '__input__': source
      }),
      commonjs(),
      resolve({
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      css(),
      svelte(),
      buble(),
      uglify()
    ]
  }

  const outputConfig = {
    format: 'iife',
    file: 'bundle.js'
  }

  return { inputConfig, outputConfig }
}
