#!/usr/bin/env node

const { dirname } = require('path')
const create = require('../src/cli/create')
const help = require('../src/cli/help')
const logo = require('../src/cli/logo')

const [ , , arg ] = process.argv

logo.run()

if (!arg) {
  require('../app')
}

if (arg === 'create') {
  create.run()
}

if (['help', '--help'].includes(arg)) {
  help.run()
}
