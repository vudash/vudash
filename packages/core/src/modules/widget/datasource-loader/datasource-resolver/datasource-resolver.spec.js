'use strict'

const { WidgetRegistrationError } = require('../../../../errors')
const resolver = require('.')

describe('widget.datasource-resolver', () => {
  it('loads datasource', (done) => {
    const datasources = { abcde: { foo: 'bar' } }
    expect(
      resolver.resolve(datasources, 'abcde')
    ).to.equal(datasources.abcde)
    done()
  })

  it('Cannot load datasource', (done) => {
    expect(() => {
      return resolver.resolve({}, 'non-existent')
    }).to.throw(WidgetRegistrationError, 'Unable to use datasource non-existent as it does not exist')
    done()
  })

  it('Widget does not define a datasource', (done) => {
    const noop = resolver.resolve({})
    expect(
      noop.fetch
    ).to.be.a.function()
    return noop.fetch()
  })
})
