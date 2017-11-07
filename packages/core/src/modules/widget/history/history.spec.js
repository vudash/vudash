'use strict'

const { create } = require('.')
const { times } = require('lodash')
const { expect } = require('code')

describe('widget-binder/history', () => {
  context('three items', () => {
    let contents
    beforeEach(() => {
      const history = create()
      history.insert('a')
      history.insert('b')
      history.insert('c')
      contents = history.fetch()
    })

    it('has all entries', () => {
      expect(contents[2]).to.equal('c')
    })

    it('is earliest first', () => {
      expect(contents[0]).to.equal('a')
    })
  })

  context('history overflow', () => {
    let contents
    beforeEach(() => {
      const history = create(2)
      history.insert('a')
      history.insert('b')
      history.insert('c')
      contents = history.fetch()
    })

    it('has length of two', () => {
      expect(contents.length).to.equal(2)
    })

    it('has all entries', () => {
      expect(contents[1]).to.equal('c')
    })

    it('is earliest first', () => {
      expect(contents[0]).to.equal('b')
    })
  })

  context('size not specified', () => {
    let contents
    let history
    beforeEach(() => {
      history = create()
      times(11, i => {
        history.insert(i)
      })
      contents = history.fetch()
    })

    it('history size is 10', () => {
      expect(history.size).to.equal(10)
    })

    it('is limited by size', () => {
      expect(contents).to.have.length(10)
    })
  })
})