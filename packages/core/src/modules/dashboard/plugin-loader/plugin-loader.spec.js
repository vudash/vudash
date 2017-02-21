'use strict'

const PluginLoader = require('.')
const DatasourceBuilder = require(fromTest('util/datasource.builder'))
const { PluginRegistrationError } = require('../../../errors')

context('Datasource registration', () => {
  let pluginLoader

  const SomeDatasource = DatasourceBuilder.create().build()
  const dashboard = {}
  const options = { foo: 'bar' }

  beforeEach((done) => {
    pluginLoader = new PluginLoader('some-id', dashboard)
    pluginLoader.options = options
    done()
  })

  it('Can register datasource', (done) => {
    pluginLoader.contributeDatasource(SomeDatasource)
    expect(dashboard.datasources).to.include('some-id')
    done()
  })

  it('Is not a datasource', (done) => {
    const fn = () => { pluginLoader.contributeDatasource({}) }
    expect(fn).to.throw(PluginRegistrationError, 'Plugin some-id does not appear to be a data-source provider')
    done()
  })

  it('Registers a datasource constructor', (done) => {
    pluginLoader.contributeDatasource(SomeDatasource)
    expect(dashboard.datasources['some-id'].Constructor).to.be.a.function()
    done()
  })

  it("Registers a datasource's validation", (done) => {
    pluginLoader.contributeDatasource(SomeDatasource)
    expect(dashboard.datasources['some-id'].options).to.equal(options)
    done()
  })

  it("Registers a datasource's validation", (done) => {
    const validation = { some: 'stuff' }
    pluginLoader.contributeDatasource(SomeDatasource, validation)
    expect(dashboard.datasources['some-id'].validation).to.equal(validation)
    done()
  })
})
