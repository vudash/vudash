'use strict'

const rollup = require('rollup')
const { build } = require('./configuration-builder')

exports.compile = function (source) {
  const { inputConfig, outputConfig } = build(source)

  return rollup
    .rollup(inputConfig)
    .then(bundle => {
      const js = bundle.generate(outputConfig)
      return js
    })
}
