'use strict'

const rollup = require('rollup')
const { build } = require('./configuration-builder')

exports.compile = function (source) {
  const config = build(source)

  return rollup
  .rollup(config)
  .then((bundle) => {
    const js = bundle.generate({
      format: 'iife'
    })
    const css = ''
    return { js, css }
  })
}
