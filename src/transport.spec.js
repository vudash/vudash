const Transport = require('./transport')
const GoogleSheetsTransport = require('./transports/google-sheets')
const RestTransport = require('./transports/rest')
const RandomTransport = require('./transports/random')

describe('transport', () => {
  it('Loads rest transport', (done) => {
    const transport = Transport.configure({transport: 'rest'})
    expect(transport).to.be.an.instanceOf(RestTransport)
    done()
  })

  it('Loads random transport', (done) => {
    const transport = Transport.configure({transport: 'random'})
    expect(transport).to.be.an.instanceOf(RandomTransport)
    done()
  })

  it('Loads google sheets transport', (done) => {
    const transport = Transport.configure({transport: 'google-sheets'})
    expect(transport).to.be.an.instanceOf(GoogleSheetsTransport)
    done()
  })
})
