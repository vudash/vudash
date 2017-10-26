'use strict'

const compiler = require('.')
const { stub } = require('sinon')
const rollup = require('rollup')
const { expect } = require('code')

describe('dashboard/compiler', () => {
  context('Bundle', () => {
    const compiled = 'abc123'
    let bundle

    before(() => {
      stub(rollup, 'rollup')

      const bundleStub = { generate: stub().returns(compiled) }
      rollup.rollup.resolves(bundleStub)
      return compiler
        .compile('zzz')
        .then((result) => {
          bundle = result
        })
    })

    after(() => {
      rollup.rollup.restore()
    })

    it('Returns compiled js', () => {
      const { js } = bundle
      expect(js).to.exist().and.to.equal(compiled)
    })
  })
})
