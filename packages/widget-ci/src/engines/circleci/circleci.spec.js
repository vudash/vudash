'use strict'

const { expect } = require('code')
const CircleCI = require('circleci')
const BuildStatus = require('../../build-status.enum')
const Engine = require('.')
const { stub } = require('sinon')

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

      getBranchBuildsStub = stub(circleci, 'getBranchBuilds')
      getBranchBuildsStub.resolves([{
        status: 'success'
      }])

      return engine.fetchBuildStatus()
      .then((result) => {
        status = result
      })
    })

    after(() => {
      getBranchBuildsStub.restore()
    })

    it('has correct repo', () => {
      expect(getBranchBuildsStub.firstCall.args[0].project).to.equal(options.repo)
      
    })

    it('has correct user', () => {
      expect(getBranchBuildsStub.firstCall.args[0].username).to.equal(options.user)
      
    })

    it('has correct branch', () => {
      expect(getBranchBuildsStub.firstCall.args[0].branch).to.equal(options.branch)
      
    })

    it('fetches correct status', () => {
      expect(status).to.equal(BuildStatus.passed)
      
    })
  })
})
