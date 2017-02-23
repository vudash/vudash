'use strict'

class Datasource {
  constructor (options) {
    this.options = options
  }

  fetch () {
    return this.options
  }
}

class DatasourceBuilder {
  constructor () {
    this.ds = Datasource
  }

  build () {
    return this.ds
  }
}

module.exports = {
  create: () => { return new DatasourceBuilder() }
}
