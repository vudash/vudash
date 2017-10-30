'use strict'

const { load } = require('.')
const { expect } = require('code')

describe('widget-binder', () => {
  context('no widgets specified', () => {
    it('has empty widget list', () => {
      const widgets = load({}, [], {})
      expect(widgets).to.equal([])
    })
  })

  describe('widget registration', () => {

  })

  describe('inward event binding', () => {

  })

  describe('widget serverside update', () => {

  })

  describe('outward event binding', () => {

  })

  context('datasource does not exist', () => {

  })

  context.skip('widgets', () => {
    it('calls register on each widget')
    const widgets = load({}, [])
  })
})
