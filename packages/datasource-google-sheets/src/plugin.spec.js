'use strict'

const Plugin = require('./plugin')

describe('datasource-google-sheets.plugin', () => {
  it('has register method', (done) => {
    expect(Plugin).to.include('register')
    done()
  })
})
