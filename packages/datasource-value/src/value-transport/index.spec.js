'use strict'

const ValueTransport = require('.')
const { expect } = require('code')

describe('value', () => {
  it('Returns value passed in config', () => {
    const config = { value: 'abc' }
    const transport = new ValueTransport(config)
    return transport.fetch().then((value) => {
      expect(value).to.equal('abc')
    })
  })
})
