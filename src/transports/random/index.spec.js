const RandomTransport = require('.')

describe('transports.random', () => {
  const MT_SEED = 'a'
  it('Returns a random number', () => {
    const transport = new RandomTransport({ config: {} }, MT_SEED)
    return transport.fetch().then((number) => {
      expect(number).to.be.above(0).and.below(1000)
    })
  })

  describe('Configuration', () => {
    const AN_EMAIL = 'urijihed@ocekode.lr'
    it('Allows method to be specified', () => {
      const transport = new RandomTransport({ config: { method: 'email' } }, MT_SEED)
      return transport.fetch().then((email) => {
        expect(email).to.equal(AN_EMAIL)
      })
    })

    it('Unknown method returns an error', (done) => {
      const transport = new RandomTransport({ config: { method: 'abcdefg' } }, MT_SEED)

      expect(transport.fetch.bind(transport)).to.throw(Error, /is not a known chance method/)
      done()
    })

    it('Passes options to method', () => {
      const options = { domain: 'xyz.com' }
      const transport = new RandomTransport({ config: { method: 'email', options } }, MT_SEED)
      return transport.fetch().then((email) => {
        expect(email).to.endWith(options.domain)
      })
    })

    it('If method is not defaulted, options are not defaulted', () => {
      const transport = new RandomTransport({ config: { method: 'email' } }, MT_SEED)
      return transport.fetch().then((email) => {
        expect(email).to.equal(AN_EMAIL)
      })
    })
  })
})
