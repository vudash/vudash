'use strict'

const path = require('path')
const glob = require('glob')

require('sinon-as-promised')

const tests = glob.sync(path.join(process.cwd(), './{,!(node_modules)/**/}*.spec.js'))
tests.forEach(fullPath => require(fullPath))
