'use strict'

const { expect } = require('code')
const sinon = require('sinon')

const BuildStatus = require('../../build-status.enum')

describe('engines.travis', () => {
  const Engine = require('.')

  it('Expects state to be returned', () => {
    const engine = new Engine({})

    engine.travis = {
      repos: sinon.stub().returns({
        builds: sinon.stub().returns({
          get: sinon.stub().yields(null, { builds: [ { state: 'passed' } ] })
        })
      })
    }

    return engine.fetchBuildStatus()
      .then((result) => {
        expect(result).to.equal(BuildStatus.passed)
      })
  })
})
