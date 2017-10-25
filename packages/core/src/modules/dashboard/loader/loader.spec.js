'use strict'

const { NotFoundError } = require('../../../errors')
const loader = require('.')

describe('dashboard/loader', () => {
  it('Dashboard is not found', () => {
    expect(() => { return loader.load('xyz') }).to.throw(NotFoundError, 'Dashboard xyz does not exist.')
  })
})