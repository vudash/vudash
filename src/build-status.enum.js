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

  static get queued () {
    return 'queued'
  }

  static get running () {
    return 'running'
  }
}

module.exports = BuildStatus
