const Travis = require('./travis')
const CircleCI = require('./circleci')

class Factory {
  constructor () {
    this.engines = {
      travis: Travis,
      circleci: CircleCI
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
