class ConfigUtil {

  _getConfig (credentialsOverride) {
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
      credentials
    }
  }

  getRangeConfig (credentialsOverride) {
    const baseConfig = this._getConfig(credentialsOverride)
    return Object.assign({ columns: ['a', 'b'], rows: { from: 1, to: 3 } }, baseConfig)
  }

  getSingleCellConfig (credentialsOverride) {
    const baseConfig = this._getConfig(credentialsOverride)
    return Object.assign({ columns: 'z', rows: 1 }, baseConfig)
  }
}

module.exports = new ConfigUtil()
