'use strict'

const RandomTransport = require('./src/random-transport')

class RandomDatasource {
  register (dashboard) {
    dashboard.contributeDatasource('random', RandomTransport)
  }
}

module.exports = new RandomDatasource()
