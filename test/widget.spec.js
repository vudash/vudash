'use strict'

const expect = require('code').expect
const sinon = require('sinon')

describe('Travis Widget', () => {
  const Widget = require('..')

  it('Reads config', (done) => {
    const config = {user: 'any-user', repo: 'some-repo'}
    const registered = new Widget().register(config)
    expect(registered.config.user).to.equal(config.user)
    expect(registered.config.repo).to.equal(config.repo)
    done()
  })

  it('Expects state to be emitted', (done) => {
    const widget = new Widget()
    let emit = sinon.stub()
    widget.travis = {
      repos: sinon.stub().returns({
        builds: sinon.stub().returns({
          get: sinon.stub().yields(null, { builds: [ { state: 'passing' } ] })
        })
      })
    }
    const registered = widget.register()
    registered.job(emit)
    setTimeout(() => {
      expect(emit.callCount).to.equal(1)
      expect(emit.firstCall.args[0]).to.equal({ state: 'passing' })
      done()
    }, 10)
  })
})
