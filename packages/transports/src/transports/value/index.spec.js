const ValueTransport = require('.')

describe('transports.value', () => {
  it('Requires a value to be passed in config', (done) => {
    const fn = () => { return new ValueTransport({ config: {} }) }
    expect(fn).to.throw(Error, /"value" is required/)
    done()
  })

  const valueTypes = [ 'string', 123, Date.now(), { a: 'x' }, () => {} ]

  valueTypes.forEach((value) => {
    it(`Allows value ${typeof value} to be passed in`, (done) => {
      const transport = new ValueTransport({ config: { value } })
      expect(transport).to.exist().and.to.be.an.instanceOf(ValueTransport)
      done()
    })
  })

  it('Returns value passed in config', () => {
    const config = { value: 'abc' }
    const transport = new ValueTransport({ config })
    return transport.fetch().then((value) => {
      expect(value).to.equal('abc')
    })
  })
})
