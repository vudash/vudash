'use strict'

const path = require('path')
const glob = require('glob')
const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

global.describe = global.context = lab.describe
global.it = lab.it
global.before = lab.before
global.beforeEach = lab.beforeEach
global.after = lab.after
global.afterEach = lab.afterEach
global.expect = Code.expect
global.sinon = require('sinon')

require('sinon-as-promised')

global.fromRoot = requirePath => {
  return path.normalize(path.join(process.cwd(), requirePath))
}

global.fromSrc = requirePath => {
  return fromRoot(`src/${requirePath}`)
}

global.fromTest = requirePath => {
  return fromRoot(`test/${requirePath}`)
}

global.resource = requirePath => {
  return fromRoot(`test/resources/${requirePath}`)
}

const tests = glob.sync(path.join(process.cwd(), '/{!(node_modules),**}/**.spec.js'))
tests.forEach(fullPath => require(fullPath))
