'use strict'

const path = require('path')
const glob = require('glob')
const Code = require('code')

require('sinon-as-promised')

global.resource = requirePath => {
  return path.normalize(path.join(process.cwd(), `test/resources/${requirePath}`))
}

const tests = glob.sync(path.join(process.cwd(), './{,!(node_modules)/**/}*.spec.js'))
tests.forEach(fullPath => require(fullPath))
