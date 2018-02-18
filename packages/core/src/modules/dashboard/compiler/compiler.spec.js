'use strict'

const compiler = require('.')
const { stub } = require('sinon')
const rollup = require('rollup')
const { expect } = require('code')

describe('dashboard/compiler', () => {
  context('Bundle', () => {
    const compiled = 'abc123'
    let js

    before(async () => {
      stub(rollup, 'rollup')

      const bundleStub = { generate: stub().returns(compiled) }
      rollup.rollup.resolves(bundleStub)
      js = await compiler.compile('zzz')
    })

    after(() => {
      rollup.rollup.restore()
    })

    it('Returns compiled js', () => {
      expect(js).to.exist().and.to.equal(compiled)
    })
  })
})
