'use strict'

const DummyDatasource = require('.')

describe('datasource.dummy-datasource', () => {
  it('can be constructed', done => {
    expect(DummyDatasource).to.be.a.function()
    done()
  })

  it('Does not fetch', done => {
    const widgetName = 'abczys'
    const ds = new DummyDatasource({ widgetName })
    expect(ds.fetch.bind(ds)).to.throw(Error, `Widget ${widgetName} requested data, but no datasource was configured. Check the widget configuration in your dashboard config.`)
    done()
  })
})
