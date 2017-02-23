const RandomTransport = require('.')

describe('random-transport', () => {
  const MT_SEED = 'a'

  it('Returns a random number', () => {
    const transport = new RandomTransport({ config: {} }, MT_SEED)
    return transport.fetch().then((number) => {
      expect(number).to.be.above(0).and.below(1000)
    })
  })
})
