'use strict'

const CircleCI = require('circleci')
const BuildStatus = require('../../build-status.enum')

const Engine = require('.')

describe('engines.circleci', () => {
  let getBranchBuildsStub

  context('Build Passed', () => {
    let status
    const options = {
      repo: 'repo',
      user: 'user',
      branch: 'branch',
      options: {
        auth: 'x'
      }
    }

    before(() => {
      const engine = new Engine(options)
      const circleci = new CircleCI({ auth: 'x' })
      engine.circleci = circleci

      getBranchBuildsStub = sinon.stub(circleci, 'getBranchBuilds')
      getBranchBuildsStub.resolves([{
        status: 'success'
      }])

      return engine.fetchBuildStatus()
      .then((result) => {
        status = result
      })
    })

    after((done) => {
      getBranchBuildsStub.restore()
      done()
    })

    it('has correct repo', (done) => {
      expect(getBranchBuildsStub.firstCall.args[0].project).to.equal(options.repo)
      done()
    })

    it('has correct user', (done) => {
      expect(getBranchBuildsStub.firstCall.args[0].username).to.equal(options.user)
      done()
    })

    it('has correct branch', (done) => {
      expect(getBranchBuildsStub.firstCall.args[0].branch).to.equal(options.branch)
      done()
    })

    it('fetches correct status', (done) => {
      expect(status).to.equal(BuildStatus.passed)
      done()
    })
  })
})
