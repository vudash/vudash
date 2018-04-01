'use strict'

const rollup = require('rollup')
const { build } = require('./configuration-builder')

exports.compile = function (source) {
  const { inputOptions, outputOptions } = build(source)

  return rollup
  .rollup(inputOptions)
  .then(bundle => {
    return bundle.generate(outputOptions)
  })
}
