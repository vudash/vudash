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

    it('Allow multiple arguments to options', () => {
      const options = ['chance.integer', 12, { min: 15, max: 32 }]
      const transport = new RandomTransport({ config: { method: 'n', options } }, MT_SEED)
      return transport.fetch().then((numbers) => {
        expect(numbers).to.be.an.array()
        expect(numbers.length).to.equal(12)
        for (const val of numbers) {
          expect(val, val).to.be.between(14, 33)
        }
      })
    })

    it('Validate for unknown method references', (done) => {
      const options = ['chance.abcde']
      const transport = new RandomTransport({ config: { method: 'n', options } }, MT_SEED)
      expect(transport.fetch.bind(transport)).to.throw(Error, /is not a known chance method/)
      done()
    })

    it('Allow shorthand chance method names', (done) => {
      const options = ['integer', 12, { min: 0, max: 1 }]
      const transport = new RandomTransport({ config: { method: 'n', options } }, MT_SEED)
      expect(transport.fetch.bind(transport)).not.to.throw()
      done()
    })
  })
})
