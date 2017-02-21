'use strict'

const plugin = require('./plugin')

describe('datasource-google-sheets.plugin', () => {
  it('has register method', (done) => {
    expect(plugin.register).to.exist()
    done()
  })
})
