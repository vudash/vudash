'use strict'

const sinon = require('sinon')
const pluginResolver = require('./resolver')
const loader = require('.')

const Dashboard = require('../dashboard')
const { PluginRegistrationError } = require('../../errors')

describe('modules.plugin-loader', () => {
  const dashboard = sinon.createStubInstance(Dashboard)
  let fakePlugin
  let FakePlugin

  beforeEach((done) => {
    fakePlugin = { register: sinon.stub() }
    FakePlugin = sinon.stub().returns(fakePlugin)
    FakePlugin.validateOptions = sinon.stub().returns()
    sinon.stub(pluginResolver, 'resolve').returns(FakePlugin)
    done()
  })

  afterEach((done) => {
    pluginResolver.resolve.restore()
    done()
  })

  context('Plugin', () => {
    it('Registers plugin with no options', (done) => {
      loader.load(dashboard, [ { plugin: 'some-plugin' } ])

      expect(FakePlugin.callCount).to.equal(1)
      expect(fakePlugin.register.callCount).to.equal(1)
      done()
    })
  })

  context('Plugin has configuration', () => {
    const options = { foo: 'bar' }

    beforeEach((done) => {
      loader.load(dashboard, [ { plugin: 'some-plugin', options } ])
      done()
    })

    it('Registers plugin with options', (done) => {
      expect(FakePlugin.firstCall.args[0]).to.equal(options)
      done()
    })

    it('Requests validation on options', (done) => {
      expect(FakePlugin.validateOptions.callCount).to.equal(1)
      expect(FakePlugin.validateOptions.firstCall.args[0]).to.equal(options)
      done()
    })
  })

  context('No validation on plugin', () => {
    const options = { foo: 'bar' }
    const pluginWithoutValidation = { register: sinon.stub() }

    it('Requests validation on options', (done) => {
      FakePlugin.returns(pluginWithoutValidation)
      pluginResolver.resolve.returns(FakePlugin)
      const fn = () => { loader.load(dashboard, [ { plugin: 'some-plugin', options } ]) }
      expect(fn).not.to.throw()
      done()
    })
  })

  context('No validation on plugin', () => {
    const options = { foo: 'bar' }

    it('Requests validation on options', (done) => {
      FakePlugin.validateOptions.returns(['Some Error', 'Other Error'])
      const fn = () => { loader.load(dashboard, [ { plugin: 'some-plugin', options } ]) }
      expect(fn).to.throw(PluginRegistrationError, 'Could not register plugin some-plugin due to invalid configuration: Some Error, Other Error')
      expect(fakePlugin.register.callCount).to.equal(0)
      done()
    })
  })
})
