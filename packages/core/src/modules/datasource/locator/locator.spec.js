'use strict'

const { WidgetRegistrationError } = require('../../../errors')
const locator = require('.')

describe('datasource.locator', () => {
  it('loads datasource', () => {
    const datasources = { abcde: { foo: 'bar' } }
    expect(
      locator.locate(datasources, 'abcde')
    ).to.equal(datasources.abcde)
  })

  it('Cannot load datasource', () => {
    expect(() => {
      return locator.locate({}, 'non-existent')
    }).to.throw(WidgetRegistrationError, 'Unable to use datasource non-existent as it does not exist')
  })
})
