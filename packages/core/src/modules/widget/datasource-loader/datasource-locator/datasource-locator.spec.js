'use strict'

const { WidgetRegistrationError } = require('../../../../errors')
const locator = require('.')

describe('widget.datasource-locator', () => {
  it('loads datasource', (done) => {
    const datasources = { abcde: { foo: 'bar' } }
    expect(
      locator.locate(datasources, 'abcde')
    ).to.equal(datasources.abcde)
    done()
  })

  it('Cannot load datasource', (done) => {
    expect(() => {
      return locator.locate({}, 'non-existent')
    }).to.throw(WidgetRegistrationError, 'Unable to use datasource non-existent as it does not exist')
    done()
  })
})
