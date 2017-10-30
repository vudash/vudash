'use strict'

const datasource = require('./datasource')
const { expect } = require('code')

describe('datasource-google-sheets/datasource', () => {
  it('has register method', () => {
    expect(datasource.register).to.exist().and.to.be.a.function()
  })

  it('exports validation', () => {
    expect(datasource.validation).to.exist()
  })
})
