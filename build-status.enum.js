class BuildStatus {
  static get passed () {
    return 'passed'
  }

  static get failed () {
    return 'failed'
  }

  static get unknown () {
    return 'unknown'
  }
}

module.exports = BuildStatus
