const Transport = require('./transport')

describe('transport', () => {
  it('Fails to load unknown transport', (done) => {
    expect(() => {
      return Transport.configure({ transport: 'pigeon', config: {} })
    }).to.throw(Error, /is not a known/)
    done()
  })
})
