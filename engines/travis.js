const Travis = require('travis-ci')
const Promise = require('bluebird').Promise
const BuildStatus = require('../build-status.enum')

class TravisEngine {
  constructor (user, repo, branch) {
    this.travis = new Travis({
      version: '2.0.0'
    })
    this.user = user
    this.repo = repo
    this.branch = branch
    this.mappings = {
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
        resolve(this.mappings[latestBuild.state] || BuildStatus.unknown)
      })
    })
  }
}

module.exports = TravisEngine
