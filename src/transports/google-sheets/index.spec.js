const GoogleSheetsTransport = require('.')
const configUtil = require('./config.util.test')

describe('transports.google-sheets', () => {
  it('With invalid config', (done) => {
    expect(() => {
      return new GoogleSheetsTransport({ config: {} })
    }).to.throw(Error, /fails because/)
    done()
  })

  it('With valid single-cell config', (done) => {
    const transport = new GoogleSheetsTransport({ config: configUtil.getSingleCellConfig() })
    expect(transport).to.be.an.instanceOf(GoogleSheetsTransport)
    done()
  })

  it('With valid range config', (done) => {
    const transport = new GoogleSheetsTransport({ config: configUtil.getRangeConfig() })
    expect(transport).to.be.an.instanceOf(GoogleSheetsTransport)
    done()
  })

  it('Invalid credentials file', (done) => {
    const credentials = 'xxx:yyy'
    expect(() => {
      return new GoogleSheetsTransport({ config: configUtil.getSingleCellConfig(credentials) })
    }).to.throw(Error, /prefixed with "file:"/)
    done()
  })

  it('Loads credentials from disk', (done) => {
    const contents = require('./example.credentials.test.json')
    const credentials = 'file:example.credentials.test.json'
    const transport = new GoogleSheetsTransport({ config: configUtil.getSingleCellConfig(credentials) })
    expect(transport.credentials).to.equal(contents)
    done()
  })

  it('File not found', (done) => {
    expect(() => {
      return new GoogleSheetsTransport({ config: configUtil.getSingleCellConfig('file:some-nonexistent-file') })
    }).to.throw(Error, /some-nonexistent-file" as it could not be found/)
    done()
  })

  it('Validates credentials loaded from disk', (done) => {
    expect(() => {
      return new GoogleSheetsTransport({ config: configUtil.getSingleCellConfig('file:example.invalid-credentials.test.json') })
    }).to.throw(Error, /fails because/)
    done()
  })

  it('Read credentials from file', (done) => {
    const credentials = 'file:example.credentials.test.json'
    const transport = new GoogleSheetsTransport({ config: configUtil.getSingleCellConfig(credentials) })
    expect(transport).to.be.an.instanceOf(GoogleSheetsTransport)
    done()
  })
})
