'use strict'

const loader = require('.')
const locator = require('./locator')
const DatasourceBuilder = require('util/datasource.builder')
const Joi = require('joi')
const validator = require('./validator')
const { expect } = require('code')
const { stub } = require('sinon')

context('datasource.validator', () => {
  const widget = DatasourceBuilder.create().build()

  context('Datasource specified', () => {
    beforeEach(() => {
      stub(locator, 'locate')
      stub(validator, 'validate').returns({})
    })

    afterEach(() => {
      locator.locate.restore()
      validator.validate.restore()
    })

    it('Registers widget data source', () => {
      locator.locate.returns({ Constructor: widget, options: {} })
      loader.load('some-widget', {}, { name: 'a-datasource' })
      expect(locator.locate.callCount).to.equal(1)
      expect(locator.locate.firstCall.args[1]).to.equal('a-datasource')
    })

    it('calls for widget validation on load', () => {
      const options = { foo: 'bar' }
      locator.locate.returns({ Constructor: widget, options: {}, validation: Joi.object().required() })
      loader.load('some-widget', {}, { name: 'a-datasource', options })
      expect(validator.validate.callCount).to.equal(1)
      expect(validator.validate.firstCall.args[2]).to.equal(options)
    })

    it('no validation specified', () => {
      locator.locate.returns({ Constructor: widget, options: {} })
      loader.load('some-widget', {}, { name: 'a-datasource' })
      expect(validator.validate.callCount).to.equal(0)
    })
  })

  context('no datasource specified', () => {
    it('will polyfill a fetch method which throws', () => {
      const loaded = loader.load('some-widget', {}, {})
      function fn () { return loaded.fetch() }
      expect(fn).to.throw('Widget some-widget requested data, but no datasource was configured. Check the widget configuration in your dashboard config.')
    })
  })
})
