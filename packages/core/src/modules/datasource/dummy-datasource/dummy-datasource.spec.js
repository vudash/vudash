'use strict'

const DummyDatasource = require('.')

describe('datasource.dummy-datasource', () => {
  it('can be constructed', () => {
    expect(DummyDatasource).to.be.a.function()
  })

  it('Does not fetch', () => {
    const widgetName = 'abczys'
    const ds = new DummyDatasource({ widgetName })
    expect(ds.fetch.bind(ds)).to.throw(Error, `Widget ${widgetName} requested data, but no datasource was configured. Check the widget configuration in your dashboard config.`)
  })
})
