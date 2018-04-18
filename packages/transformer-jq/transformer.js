'use strict'

const { sync } = require('execa')
const { join } = require('path')

class JqTransformer {
  constructor (transformation) {
    this.transformation = transformation
  }

  transform (data) {
    const jqn = join(__dirname, 'node_modules', '.bin', 'jqn')
    const input = `'${JSON.stringify(data)}'`
    const transformation = `"${this.transformation.value}"`
    return sync('echo', [input, '|', jqn, transformation, '-j'])
  }
}

module.exports = JqTransformer
