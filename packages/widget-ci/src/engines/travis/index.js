'use strict'

const Travis = require('travis-ci')
const Promise = require('bluebird').Promise
const BuildStatus = require('../../build-status.enum')

class TravisEngine {
  constructor (options) {
    this.travis = new Travis({
      version: '2.0.0'
    })
    this.user = options.user
    this.repo = options.repo
    this.branch = options.branch
    this.mappings = {
      started: BuildStatus.running,
      created: BuildStatus.queued,
      passed: BuildStatus.passed,
      failed: BuildStatus.failed
    }
  }

  fetchBuildStatus () {
    return new Promise((resolve, reject) => {
      this.travis.repos(this.user, this.repo).builds().get((err, res) => {
        if (err) { throw err }
        if (!res.builds || !res.builds.length) {
          reject(new Error('No builds found'))
        }

        const latestBuild = res.builds[0]
        console.log(latestBuild.state)
        resolve(this.mappings[latestBuild.state] || BuildStatus.unknown)
      })
    })
  }
}

module.exports = TravisEngine
