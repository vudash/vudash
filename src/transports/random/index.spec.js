const RandomTransport = require('.')

describe('transports.rest', () => {
  it('Returns a random number', () => {
    const transport = new RandomTransport({config: {}})
    return transport.fetch().then((number) => {
      expect(number).to.be.above(0).and.below(1000)
    })
  })
})
