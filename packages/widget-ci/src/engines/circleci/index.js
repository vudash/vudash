'use strict'

const CircleCI = require('circleci')
const BuildStatus = require('../../build-status.enum')

class CircleCIEngine {
  constructor (options) {
    this.circleci = new CircleCI({ auth: options.options.auth })
    this.user = options.user
    this.repo = options.repo
    this.branch = options.branch
    this.mappings = {
      success: BuildStatus.passed,
      failed: BuildStatus.failed,
      fixed: BuildStatus.passed,
      canceled: BuildStatus.failed,
      infrastructure_fail: BuildStatus.failed,
      timedout: BuildStatus.failed,
      running: BuildStatus.running,
      queued: BuildStatus.queued,
      scheduled: BuildStatus.queued
    }
  }

  fetchBuildStatus () {
    return this.circleci.getBranchBuilds({ username: this.user,
      project: this.repo,
      branch: this.branch,
      limit: 1
    })
    .then((builds) => {
      if (builds.length < 1) {
        throw new Error('No builds found')
      }

      const latestBuild = builds[0]
      return this.mappings[latestBuild.status] || BuildStatus.unknown
    })
  }
}

module.exports = CircleCIEngine
