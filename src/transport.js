const RestTransport = require('./transports/rest')
const GoogleSheetsTransport = require('./transports/google-sheets')
const RandomTransport = require('./transports/random')

const mappings = {
  'rest': RestTransport,
  'google-sheets': GoogleSheetsTransport,
  'random': RandomTransport
}

module.exports = {
  configure: (config) => {
    const TransportClass = mappings[config.transport]
    return new TransportClass(config)
  }
}
