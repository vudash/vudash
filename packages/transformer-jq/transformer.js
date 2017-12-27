'use strict'

const jq = require('jq-web')

class JqTransformer {
  constructor (transformation) {
    this.transformation = transformation
  }

  transform (data) {
    return jq(data, this.transformation)
  }
}

module.exports = JqTransformer
