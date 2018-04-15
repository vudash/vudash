'use strict'

const builder = require('.')
const { reach } = require('hoek')
const { expect } = require('code')

describe('dashboard/compiler/configuration-builder', () => {
  context('Dynamic Contents', () => {
    it('Contents correctly set', () => {
      const expected = '__input__'
      const { inputConfig } = builder.build(expected)
      const actual = reach(inputConfig, 'entry')
      expect(actual).to.exist().and.to.equal(expected)
    })
  })
})
