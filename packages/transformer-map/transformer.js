'use strict'

const { transform } = require('reorient')

class MapTransformer {
  constructor (schema) {
    this.schema = schema
  }

  transform (data) {
    const { value } = transform(data, this.schema)
    return value
  }
}

module.exports = MapTransformer
