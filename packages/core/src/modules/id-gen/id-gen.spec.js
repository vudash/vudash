'use strict'

const id = require('.')

describe('id-gen', (done) => {
  it('generates a string id', done => {
    expect(id())
      .to.exist()
      .and.to.be.a.string()
    done()
  })
})
