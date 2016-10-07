const ValueTransport = require('.')

describe('transports.value', () => {
  it('Requires a value to be passed in config', (done) => {
    const fn = () => { return new ValueTransport({ config: {} }) }
    expect(fn).to.throw(Error, /"value" is required/)
    done()
  })

  it('Returns value passed in config', () => {
    const config = { value: 'abc' }
    const transport = new ValueTransport({ config })
    return transport.fetch().then((value) => {
      expect(value).to.equal('abc')
    })
  })
})
