'use strict'

const descriptorParser = require('.')
const fs = require('fs')
const { expect } = require('code')

describe('dashboard/parser', () => {
  context('Parse', () => {
    it('Throws on invalid schema', () => {
      const fn = () => { return descriptorParser.parse({}) }
      expect(fn).to.throw(Error)
    })

    const boards = fs.readdirSync('./dashboards')

    boards.forEach((board) => {
      it(`Parses valid schema ${board}`, () => {
        const json = require(`../../../../dashboards/${board}`)
        descriptorParser.parse(json)
      })
    })
  })
})
