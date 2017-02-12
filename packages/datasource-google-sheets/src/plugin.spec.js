'use strict'

const Plugin = require('./plugin')

describe('datasource-google-sheets.plugin', () => {
  it('has register method', (done) => {
    const plugin = new Plugin()
    expect(plugin.register).to.exist()
    done()
  })
})
