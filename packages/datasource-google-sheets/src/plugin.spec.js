'use strict'

const plugin = require('./plugin')

describe('datasource-google-sheets.plugin', () => {
  it('has register method', () => {
    expect(plugin.register).to.exist()
    
  })
})
