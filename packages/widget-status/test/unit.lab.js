'use strict'

const path = require('path')
const glob = require('glob')

const Lab = require('lab')
const lab = Lab.script()

exports.lab = lab

global.expect = require('code').expect

global.context = lab.describe
global.describe = lab.describe
global.it = lab.it
global.before = lab.before
global.beforeEach = lab.beforeEach
global.after = lab.after
global.afterEach = lab.afterEach

const tests = glob.sync(path.join(__dirname, '..', 'src', '**/**.spec.js'))
tests.forEach(fullPath => require(fullPath))
