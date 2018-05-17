'use strict'

const { jq } = require('jq.node')
const { Promise } = require('bluebird')

class JqTransformer {
  constructor (transformation) {
    this.transformation = transformation
  }

  transform (data) {
    const input = JSON.stringify(data)
    return new Promise((resolve, reject) => {
      jq(input, this.transformation.value, {}, function (err, result) {
        if (err) {
          return reject(err)
        }
        const json = JSON.parse(result)
        return resolve(json)
      })
    })
  }
}

module.exports = JqTransformer
