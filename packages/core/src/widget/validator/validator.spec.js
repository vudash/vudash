'use strict'

const { expect } = require('code')
const { validate } = require('.')

describe('widget/validator', () => {
  it('has no validation', () => {
    const descriptor = { a: 'b' }
    expect(
      validate('xyz', null, descriptor)
    ).to.equal(descriptor)
  })
})
