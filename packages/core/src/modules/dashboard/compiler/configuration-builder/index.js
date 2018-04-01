'use strict'

const svelte = require('rollup-plugin-svelte')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const virtual = require('rollup-plugin-virtual')
const css = require('rollup-plugin-postcss')
const svg = require('rollup-plugin-svg')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const { join } = require('path')

exports.build = function (config, additionalCss) {
  const template = join(__dirname, 'main-app.html')
  const inputOptions = {
    input: '__entry__',
    plugins: [
      svg(),
      replace({
        include: template,
        'main_component': config
      }),
      virtual({
        '__additional_css__': `
          ${additionalCss}
        `,
        '__entry__': `
          import App from '${template}'
          const app = new App({
            target: document.getElementById('app'),
            data: {}
          })
        `
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
