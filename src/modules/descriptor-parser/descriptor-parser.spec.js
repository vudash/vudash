'use strict'

const descriptorParser = require('.')
const fs = require('fs')

describe('modules/descriptor-parser', () => {
  context('Parse', () => {
    it('Throws on invalid schema', (done) => {
      const fn = () => { return descriptorParser.parse({}) }
      expect(fn).to.throw(Error)
      done()
    })

    const boards = fs.readdirSync('./dashboards')

    boards.forEach((board) => {
      it(`Parses valid schema ${board}`, (done) => {
        const json = require(`../../../dashboards/${board}`)
        descriptorParser.parse(json)
        done()
      })
    })
  })
})
