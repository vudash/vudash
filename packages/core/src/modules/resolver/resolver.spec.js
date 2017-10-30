'use strict'

const { discover } = require('.')
const { expect } = require('code')
const { resolve } = require('path')

describe('resolver', () => {
  context('An npm module', () => {
    const rootDir = resolve(process.cwd(), '../..')

    it('returns path', () => {
      expect(
        discover('code')
      ).to.equal(
        `${rootDir}/node_modules/code/lib/index.js`
      )
    })
  })

  context('A local module', () => {
    it('returns path', () => {
      expect(
        discover('test/resources/widgets/example')
      ).to.equal(
        `${process.cwd()}/test/resources/widgets/example`
      )
    })
  })
})
