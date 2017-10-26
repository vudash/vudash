'use strict'

const plugin = require('./plugin')
const { expect } = require('code')

describe('datasource-google-sheets.plugin', () => {
  it('has register method', () => {
    expect(plugin.register).to.exist()
  })
})
