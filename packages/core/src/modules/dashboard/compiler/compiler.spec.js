'use strict'

const compiler = require('.')
const { stub } = require('sinon')
const rollup = require('rollup')

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

    after(done => {
      rollup.rollup.restore()
      done()
    })

    it('Returns compiled js', done => {
      const { js } = bundle
      expect(js).to.exist().and.to.equal(compiled)
      done()
    })
  })
})
