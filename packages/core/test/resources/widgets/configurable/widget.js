'use strict'

const { Promise } = require('bluebird')
const defaults = {
  foo: 'bar',
  working: false
}

class ExampleWidget {
  constructor (options) {
    this.options = Object.assign({}, defaults, options)
  }

  update (data) {
    return Promise.resolve(this.options)
  }
}

exports.register = (options) => {
  return new ExampleWidget(options)
}
