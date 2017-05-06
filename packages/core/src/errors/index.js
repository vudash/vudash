'use strict'

const { upperCamel } = require('../modules/upper-camel')

const requireDirectory = require('require-directory')
const errors = requireDirectory(module, {
  rename: upperCamel
})

module.exports = errors
