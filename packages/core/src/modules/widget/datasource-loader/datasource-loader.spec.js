'use strict'

const loader = require('.')
const datasourceResolver = require('./datasource-resolver')
const configValidator = require('../../config-validator')
const DatasourceBuilder = require(fromTest('util/datasource.builder'))

context.only('widget.datasource-loader', () => {
  const validatingWidget = DatasourceBuilder.create().addWidgetValidation().build()
  const nonValidatingWidget = DatasourceBuilder.create().build()

  const dashboard = {
    datasources: {
      'has-validation': {
        constructor: validatingWidget,
        options: { foo: 'bar' }
      },
      'no-validation': {
        constructor: nonValidatingWidget
      }
    }
  }

  beforeEach((done) => {
    const options = {}
    sinon.stub(datasourceResolver, 'resolve')
    .returns({ constructor: validatingWidget, options })
    sinon.stub(configValidator, 'validate').returns({})
    done()
  })

  afterEach((done) => {
    datasourceResolver.resolve.restore()
    configValidator.validate.restore()
    done()
  })

  it('Registers widget data source', (done) => {
    const datasource = loader.load('some-widget', dashboard, { datasource: 'no-validation' })
    expect(datasource.fetch).to.be.a.function()
    done()
  })

  it('calls for widget validation on load', (done) => {
    loader.load('some-widget', dashboard, { datasource: 'has-validation' })
    expect(configValidator.validate.callCount).to.equal(1)
    done()
  })

  it('no widget validation specified', (done) => {
    loader.load('some-widget', dashboard, { datasource: 'no-validation' })
    expect(configValidator.validate.callCount).to.equal(0)
    done()
  })

  it('no datasource specified', (done) => {
    loader.load('some-widget', dashboard, {})
    expect(configValidator.validate.callCount).to.equal(0)
    done()
  })
})
