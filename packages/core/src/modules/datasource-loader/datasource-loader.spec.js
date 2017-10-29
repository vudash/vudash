'use strict'

const { expect } = require('code')
const { stub } = require('sinon')
const datasourceLoader = require('.')
const resolver = require('../resolver')
const binder = require('../datasource-binder')
const validator = require('../config-validator')

describe.only('core/datasource-loader', () => {
  describe('datasource prototype', () => {
    const descriptor = {
      someDatasource: {
        module: '../some/path',
        schedule: 1000,
        options: {
          foo: 'bar'
        }
      }
    }

    context('missing fetch function', () => {
      const someDatasource = {
        register: options => {
          return {}
        }
      }

      beforeEach(() => {
        stub(resolver, 'resolve').returns(someDatasource)
      })

      it('fails to load', () => {
        expect(() => {
          datasourceLoader.load(descriptor)
        }).to.throw(
          Error,
          'Cannot load datasource someDatasource because it does not look like a datasource (no fetch function)'
        )
      })

      afterEach(() => {
        resolver.resolve.restore()
      })
    })

    context('missing registration function', () => {
      const someDatasource = {}

      beforeEach(() => {
        stub(resolver, 'resolve').returns(someDatasource)
      })

      it('fails to load', () => {
        expect(() => {
          datasourceLoader.load(descriptor)
        }).to.throw(
          Error,
          'Cannot load datasource someDatasource because it does not look like a datasource (no registration function)'
        )
      })

      afterEach(() => {
        resolver.resolve.restore()
      })
    })
  })

  context('multiple datasources', () => {
    let datasources

    const descriptor = {
      'plugin-a': {
        module: '../some/path'
      },
      'plugin-b': {
        module: '../some/path'
      }
    }

    const bound = { some: 'value' }

    const datasource = {
      register: () => {
        return {
          fetch: () => {}
        }
      }
    }

    beforeEach(() => {
      stub(resolver, 'resolve').returns(datasource)
      stub(validator, 'validate').returns({})
      stub(binder, 'bind').returns(bound)
      datasources = datasourceLoader.load(descriptor)
    })

    afterEach(() => {
      resolver.resolve.restore()
      validator.validate.restore()
      binder.bind.restore()
    })

    it('contains two datasources', () => {
      const datasourceNames = Object.keys(datasources)
      expect(datasourceNames.length).to.equal(2)
    })

    it('datasources are exposed', () => {
      expect(datasources['plugin-a']).to.equal(bound)
    })
  })
})
