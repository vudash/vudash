'use strict'

const id = require('.')

describe('id-gen', (done) => {
  expect(id())
    .to.exist()
    .and.to.be.a.string()
})
