'use strict'

const id = require('.')
const { expect } = require('code')

describe('id-gen', () => {
  it('generates a string id', () => {
    expect(id())
      .to.exist()
      .and.to.be.a.string()
  })
})
