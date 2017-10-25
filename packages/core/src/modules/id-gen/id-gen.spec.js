'use strict'

const id = require('.')

describe('id-gen', () => {
  it('generates a string id', () => {
    expect(id())
      .to.exist()
      .and.to.be.a.string()
    
  })
})
