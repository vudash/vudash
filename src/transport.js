const RestTransport = require('./transports/rest')
const GoogleSheetsTransport = require('./transports/google-sheets')

const mappings = {
  'rest': RestTransport,
  'google-sheets': GoogleSheetsTransport
}

module.exports = {
  configure: (config) => {
    const TransportClass = mappings[config.transport]
    return new TransportClass(config)
  }
}
