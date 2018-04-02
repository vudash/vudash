'use strict'

const { NotFoundError } = require('../../../errors')
const loader = require('.')
const { expect } = require('code')

describe('dashboard/loader', () => {
  it('Dashboard is not found on filesystem', () => {
    expect(() => { return loader.load({}, 'xyz') }).to.throw(NotFoundError, 'Dashboard xyz does not exist.')
  })

  describe('cache', () => {
    context('Exists in cache', () => {
      it('returns a dashboard', () => {
        expect(
          loader.find({ 'abc': 'xyz' }, 'abc')
        ).to.equal('xyz')
      })
    })

    context('Does not exist in cache', () => {
      it('throws an error', () => {
        expect(() => {
          return loader.find({}, 'abc')
        }).to.throw(NotFoundError)
      })
    })
  })
})
