'use strict'

const loader = require('.')
const datasourceLocator = require('./datasource-locator')
const configValidator = require('../../config-validator')
const DatasourceBuilder = require(fromTest('util/datasource.builder'))
const Joi = require('joi')

context('widget.datasource-loader', () => {
  const widget = DatasourceBuilder.create().build()

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
    datasourceLocator.locate.returns({ Constructor: widget, options: {} })
    loader.load('some-widget', {}, { name: 'a-datasource' })
    expect(datasourceLocator.locate.callCount).to.equal(1)
    expect(datasourceLocator.locate.firstCall.args[1]).to.equal('a-datasource')
    done()
  })

  it('calls for widget validation on load', (done) => {
    const options = { foo: 'bar' }
    datasourceLocator.locate.returns({ Constructor: widget, options: {}, validation: Joi.object().required() })
    loader.load('some-widget', {}, { name: 'a-datasource', options })
    expect(configValidator.validate.callCount).to.equal(1)
    expect(configValidator.validate.firstCall.args[2]).to.equal(options)
    done()
  })

  it('no validation specified', (done) => {
    datasourceLocator.locate.returns({ Constructor: widget, options: {} })
    loader.load('some-widget', {}, { name: 'a-datasource' })
    expect(configValidator.validate.callCount).to.equal(0)
    done()
  })

  it('no datasource specified', (done) => {
    loader.load('some-widget', {}, {})
    expect(configValidator.validate.callCount).to.equal(0)
    done()
  })

  context('Global Options', () => {
    beforeEach((done) => {
      const datasourceOptions = { a: 'b' }
      datasourceLocator.locate.returns({ Constructor: widget, options: datasourceOptions, validation: Joi.object().required() })
      done()
    })

    it('combines all datasource options', (done) => {
      const widgetDatasourceOptions = { c: 'd' }
      loader.load('some-widget', {}, { name: 'a-datasource', options: widgetDatasourceOptions })

      expect(configValidator.validate.callCount).to.equal(1)
      expect(configValidator.validate.firstCall.args[2]).to.equal({ a: 'b', c: 'd' })
      done()
    })

    it('local options override global options', (done) => {
      const widgetDatasourceOptions = { a: 'q', c: 'd' }
      loader.load('some-widget', {}, { name: 'a-datasource', options: widgetDatasourceOptions })

      expect(configValidator.validate.callCount).to.equal(1)
      expect(configValidator.validate.firstCall.args[2]).to.equal({ a: 'q', c: 'd' })
      done()
    })
  })
})
