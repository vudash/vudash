'use strict'

const RandomTransport = require('./src/random-transport')
const { validation } = require('./datasource-validation')

class RandomDatasource {
  register (dashboard) {
    dashboard.contributeDatasource(RandomTransport, validation)
  }
}

module.exports = new RandomDatasource()
