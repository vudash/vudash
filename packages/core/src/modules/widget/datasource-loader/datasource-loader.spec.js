'use strict'

const loader = require('.')
const datasourceLocator = require('./datasource-locator')
const configValidator = require('../../config-validator')
const DatasourceBuilder = require(fromTest('util/datasource.builder'))

context('widget.datasource-loader', () => {
  const validatingWidget = DatasourceBuilder.create().addWidgetValidation().build()
  const nonValidatingWidget = DatasourceBuilder.create().build()

  beforeEach((done) => {
    sinon.stub(datasourceLocator, 'locate')
    sinon.stub(configValidator, 'validate').returns({})
    done()
  })

  afterEach((done) => {
    datasourceLocator.locate.restore()
    configValidator.validate.restore()
    done()
  })

  it('Registers widget data source', (done) => {
    datasourceLocator.locate.returns({ constructor: nonValidatingWidget, options: {} })
    loader.load('some-widget', {}, { datasource: { name: 'no-validation' } })
    expect(datasourceLocator.locate.callCount).to.equal(1)
    expect(datasourceLocator.locate.firstCall.args[1]).to.equal('no-validation')
    done()
  })

  it('calls for widget validation on load', (done) => {
    const options = { foo: 'bar' }
    datasourceLocator.locate.returns({ constructor: validatingWidget, options: {} })
    loader.load('some-widget', {}, { datasource: { name: 'has-validation', options } })
    expect(configValidator.validate.callCount).to.equal(1)
    expect(configValidator.validate.firstCall.args[2]).to.equal(options)
    done()
  })

  it('no widget validation specified', (done) => {
    datasourceLocator.locate.returns({ constructor: nonValidatingWidget, options: {} })
    loader.load('some-widget', {}, { datasource: { name: 'no-validation' } })
    expect(configValidator.validate.callCount).to.equal(0)
    done()
  })

  it('no datasource specified', (done) => {
    loader.load('some-widget', {}, {})
    expect(configValidator.validate.callCount).to.equal(0)
    done()
  })
})
