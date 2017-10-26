'use strict'

const builder = require('.')
const { reach } = require('hoek')
const { expect } = require('code')

describe('dashboard/compiler/configuration-builder', () => {
  context('Dynamic Contents', () => {
    it('Contents correctly set', () => {
      const expected = 'xyz'
      const config = builder.build(expected)
      const actual = reach(config, 'entry.contents')
      expect(actual).to.exist().and.to.equal(expected)
    })
  })
})
