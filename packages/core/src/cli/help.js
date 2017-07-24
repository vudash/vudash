'use strict'

const { bold } = require('chalk')

exports.run = function () {
  console.log('Usage: vudash [action]')
  console.log('with no action, runs the dashboard configured in the current working directory.')
  console.log('\nactions:')
  console.log('\n', bold('create'), 'Create a new dashboard')
}
