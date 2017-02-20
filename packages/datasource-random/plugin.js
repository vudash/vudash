'use strict'

const RandomTransport = require('./src/random-transport')

class RandomDatasource {
  register (dashboard, options) {
    dashboard.contributeDatasource('random', RandomTransport)
  }
}

module.exports = new RandomDatasource()
