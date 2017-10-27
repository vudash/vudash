'use strict'

const PluginLoader = require('.')
const DatasourceBuilder = require('util/datasource.builder')
const { PluginRegistrationError } = require('../../../errors')
const resolver = require('../../resolver')
const { expect } = require('code')
const { stub } = require('sinon')

describe('plugin.loader', () => {
  context('Datasource registration', () => {
    let pluginLoader

    const SomeDatasource = DatasourceBuilder.create().build()
    const dashboard = {}
    const options = { foo: 'bar' }

    beforeEach(() => {
      pluginLoader = new PluginLoader('some-id', dashboard)
      pluginLoader.options = options
    })

    it('Can register datasource', () => {
      pluginLoader.contributeDatasource(SomeDatasource)
      expect(dashboard.datasources).to.include('some-id')
    })

    it('Is not a datasource', () => {
      const fn = () => { pluginLoader.contributeDatasource({}) }
      expect(fn).to.throw(PluginRegistrationError, 'Plugin some-id does not appear to be a data-source provider')
    })

    it('Registers a datasource constructor', () => {
      pluginLoader.contributeDatasource(SomeDatasource)
      expect(dashboard.datasources['some-id'].Constructor).to.be.a.function()
    })

    it("Registers a datasource's options", () => {
      pluginLoader.contributeDatasource(SomeDatasource)
      expect(dashboard.datasources['some-id'].options).to.equal({
        foo: 'bar',
        schedule: 30000
      })
    })

    it("Registers a datasource's validation", () => {
      const validation = { some: 'stuff' }
      pluginLoader.contributeDatasource(SomeDatasource, validation)
      expect(dashboard.datasources['some-id'].validation).to.equal(validation)
    })
  })

  context('Datasource without any global config provided', () => {
    let pluginLoader

    const SomeDatasource = DatasourceBuilder.create().build()
    const dashboard = {}

    beforeEach(() => {
      stub(resolver, 'resolve').returns({ register: stub() })
      pluginLoader = new PluginLoader('some-id', dashboard)
      pluginLoader.load({ module: 'xyz' })
    })

    afterEach(() => {
      resolver.resolve.restore()
    })

    it("Registers a datasource with default options", () => {
      pluginLoader.contributeDatasource(SomeDatasource)
      expect(dashboard.datasources['some-id'].options).to.equal({
        schedule: 30000
      })
    })
  })
})
