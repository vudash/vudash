const Travis = require('./travis')

class Factory {
  constructor () {
    this.engines = {
      travis: Travis
    }
  }

  getEngine (engine) {
    return this.engines[engine]
  }

  get availableEngines () {
    return Object.keys(this.engines)
  }
}

module.exports = new Factory()
