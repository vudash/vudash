'use strict'

const Widget = require('../widget')
const Travis = require('./engines/travis')
const BuildStatus = require('./build-status.enum')
const engineFactory = require('./engines/factory')

describe('widget', () => {
  it('No config for travis', (done) => {
    const config = { schedule: 25000, provider: 'travis', user: 'x', repo: 'y' }
    const widget = new Widget()
    const configuration = widget.register(config)
    expect(configuration.schedule).to.equal(config.schedule)
    done()
  })

  it('Auth for circleci', (done) => {
    const config = { schedule: 25000, provider: 'circleci', user: 'x', repo: 'y', options: { auth: 'aaa' } }
    const widget = new Widget()
    const configuration = widget.register(config)
    expect(configuration.schedule).to.equal(config.schedule)
    done()
  })

  context('Given a particular status, job plays a sound', () => {
    let instance
    let sandbox
    let emitStub

    before(() => {
      sandbox = sinon.sandbox.create()
      const travisStub = sinon.createStubInstance(Travis)
      travisStub.fetchBuildStatus.resolves(BuildStatus.passed)
      const TravisClassStub = sandbox.stub(Travis.prototype, 'constructor').returns(travisStub)
      sandbox.stub(engineFactory, 'getEngine').returns(TravisClassStub)
      emitStub = sandbox.stub()

      const widget = new Widget()
      instance = widget.register({
        provider: 'travis',
        user: 'x',
        repo: 'y',
        sounds: {
          passed: 'recovery-sound'
        }
      }, emitStub)

      return instance.job()
    })

    after((done) => {
      sandbox.restore()
      done()
    })

    it('Calls stub', (done) => {
      expect(emitStub.callCount).to.equal(1)
      done()
    })

    it('Emits sound event', (done) => {
      expect(emitStub.firstCall.args[0]).to.equal('audio:play')
      done()
    })

    it('Delivers sound payload', (done) => {
      expect(emitStub.firstCall.args[1]).to.equal('recovery-sound')
      done()
    })

    it('Sound only plays on state change', () => {
      return instance.job()
      .then(() => {
        expect(emitStub.callCount).to.equal(1)
      })
    })
  })

  const soundScenarios = [
    { scenario: 'all specified', sounds: { passed: 'x', failed: 'y', unknown: 'z' } },
    { scenario: 'passed specified', sounds: { passed: 'x' } },
    { scenario: 'failed specified', sounds: { failed: 'y' } },
    { scenario: 'unknown specified', sounds: { unknown: 'z' } }
  ]

  soundScenarios.forEach((scenario) => {
    it(`Sound config ${scenario}`, (done) => {
      const config = { schedule: 25000, provider: 'travis', user: 'x', repo: 'y', sounds: scenario.sounds }
      const widget = new Widget()
      const configuration = widget.register(config)
      expect(configuration.schedule).to.equal(config.schedule)
      done()
    })
  })
})
