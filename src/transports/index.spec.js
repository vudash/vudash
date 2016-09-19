const Transport = require('.')

describe('transports.transport', () => {
  const config = {}
  const transport = new Transport({ config })

  it('Initialises with config', (done) => {
    expect(transport.config).to.equal(config)
    done()
  })

  it('Abstract transport does not implement fetch', (done) => {
    expect(transport.fetch).to.throw(Error, /does not implement/)
    done()
  })
})
