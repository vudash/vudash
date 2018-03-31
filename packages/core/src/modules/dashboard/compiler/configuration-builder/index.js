'use strict'

const svelte = require('rollup-plugin-svelte')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const virtual = require('rollup-plugin-virtual')
const css = require('rollup-plugin-postcss')
const svg = require('rollup-plugin-svg')
const buble = require('rollup-plugin-buble')

exports.build = function (source) {
  const inputOptions = {
    input: 'dashboard.js',
    plugins: [
      svg(),
      virtual({
        'dashboard.js': source
      }),
      commonjs(),
      resolve({
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      css(),
      svelte(),
      buble()
    ]
  }

  const outputOptions = {
    file: 'bundle.js',
    format: 'iife'
  }

  return { inputOptions, outputOptions }
}
