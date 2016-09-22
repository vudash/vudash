const GoogleSheetsTransport = require('.')

describe.only('transports.google-sheets', () => {
  it('With invalid config', (done) => {
    expect(() => {
      return new GoogleSheetsTransport({ config: {} })
    }).to.throw(Error, /fails because/)
    done()
  })

  it('With valid config', (done) => {
    const transport = new GoogleSheetsTransport({ config: getConfig() })
    expect(transport).to.be.an.instanceOf(GoogleSheetsTransport)
    done()
  })

  it('Invalid credentials file', (done) => {
    const credentials = 'xxx:yyy'
    expect(() => {
      return new GoogleSheetsTransport({ config: getConfig(credentials) })
    }).to.throw(Error, /prefixed with "file:"/)
    done()
  })

  it('Loads credentials from disk', (done) => {
    const contents = require('./example.credentials.test.json')
    const credentials = 'file:example.credentials.test.json'
    const transport = new GoogleSheetsTransport({ config: getConfig(credentials) })
    expect(transport.credentials).to.equal(contents)
    done()
  })

  it('File not found', (done) => {
    expect(() => {
      return new GoogleSheetsTransport({ config: getConfig('file:some-nonexistent-file') })
    }).to.throw(Error, /some-nonexistent-file" as it could not be found/)
    done()
  })

  it('Validates credentials loaded from disk', (done) => {
    expect(() => {
      return new GoogleSheetsTransport({ config: getConfig('file:example.invalid-credentials.test.json') })
    }).to.throw(Error, /fails because/)
    done()
  })

  it('Read credentials from file', (done) => {
    const credentials = 'file:example.credentials.test.json'
    const transport = new GoogleSheetsTransport({ config: getConfig(credentials) })
    expect(transport).to.be.an.instanceOf(GoogleSheetsTransport)
    done()
  })

  function getConfig (credentialsOverride) {
    const uri = 'http://a.b'

    const credentials = credentialsOverride || {
      type: 'service_account',
      project_id: 'd',
      private_key_id: 'a',
      private_key: 'b',
      client_email: 'p@x.y',
      client_id: '123',
      auth_uri: uri,
      token_uri: uri,
      auth_provider_x509_cert_url: uri,
      client_x509_cert_url: uri
    }

    return {
      sheet: 'x',
      tab: 'y',
      column: 'z',
      formatter: 'p',
      credentials
    }
  }
})
