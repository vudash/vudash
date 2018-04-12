'use strict'

const { Promise } = require('bluebird')

class ExampleWidget {
  update (data) {
    return Promise.resolve({x: 'y'})
  }
}

exports.register = () => {
  return new ExampleWidget()
}
