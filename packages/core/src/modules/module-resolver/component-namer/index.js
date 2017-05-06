'use strict'

const { flow, camelCase, upperFirst } = require('lodash')

exports.sanitizeComponentName = function (name) {
  const rename = flow([camelCase, upperFirst])
  return rename(name)
}
