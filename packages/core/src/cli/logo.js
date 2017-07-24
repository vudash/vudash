'use strict'

const { textSync } = require('figlet')
const { yellow, blue } = require('chalk')
const { version } = require('../../package.json')

exports.run = function () {
  console.log(
    yellow(
      textSync('vudash', {
        font: 'Slant'
      })
    ),
    blue(
      `v${version}`
    )
  )
}
