'use strict'

const { load } = require('.')
const { expect } = require('code')
const { stub } = require('sinon')
const resolver = require('../resolver')
const { ConfigurationError } = require('../../errors')

describe('transform-loader', () => {
  class SomeTransformer {}
  class OtherTransformer {}

  context('transformers with configuration', () => {
    let transformers

    const configuration = [
      {
        transformer: 'some-transformer',
        options: {
          foo: 'bar'
        }
      },
      {
        transformer: 'other-transformer',
        options: {}
      }
    ]

    beforeEach(() => {
      stub(resolver, 'resolve')

      resolver.resolve
        .withArgs('some-transformer')
        .returns(SomeTransformer)
      resolver.resolve
        .withArgs('other-transformer')
        .returns(OtherTransformer)
      transformers = load('x', configuration)
    })

    afterEach(() => {
      resolver.resolve.restore()
    })

    it('loads two transformers', () => {
      expect(transformers.length).to.equal(2)
    })

    it('loads first transformer', () => {
      expect(transformers[0]).to.be.an.instanceof(SomeTransformer)
    })

    it('loads second transformer', () => {
      expect(transformers[1]).to.be.an.instanceof(OtherTransformer)
    })

    it('requests transformer modules', () => {
      expect(resolver.resolve.callCount).to.equal(2)
    })
  })

  context('empty transformer list', () => {
    const configuration = []

    it('loads no transformers', () => {
      expect(
        load('x', configuration)
      )
      .to.be.an.array()
      .and.to.have.length(0)
    })
  })

  describe('validation', () => {
    context('missing transformer name', () => {
      const configuration = [{}]

      beforeEach(() => {
        stub(resolver, 'resolve')
      })

      afterEach(() => {
        resolver.resolve.restore()
      })

      it('throws a validation error', () => {
        expect(() => {
          load('x', configuration)
        }).to.throw(ConfigurationError, /"Transformer module name" is required/)
      })
    })
  })
})
