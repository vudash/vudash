'use strict'

const { NotFoundError } = require('../../errors')
const loader = require('.')
const { expect } = require('code')

describe('dashboard/loader', () => {
  it('Dashboard is not found', () => {
    expect(() => {
      return loader.load({}, 'xyz')
    }).to.throw(NotFoundError, 'Dashboard xyz does not exist.')
  })

  context('#add()', () => {
    const cache = {}
    const emitter = { on: () => { } }
    const descriptor = { layout: { columns: 0, rows: 0 }, widgets: [] }

    beforeEach(() => {
      loader.add(cache, 'xyz', emitter, descriptor)
    })

    it('Add dashboard to cache', () => {
      expect(cache.xyz.descriptor).to.equal(descriptor)
    })

    it('Find dashboard from cache', () => {
      expect(loader.find(cache, 'xyz', emitter).descriptor).to.equal(descriptor)
    })
  })

  context('#has()', () => {
    const cache = { 'abc': {} }
    it('is contained in cache', () => {
      expect(loader.has(cache, 'abc')).to.be.true()
    })

    it('is not contained in cache', () => {
      expect(loader.has(cache, 'xyz')).to.be.false()
    })
  })
})
