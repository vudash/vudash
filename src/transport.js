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

    if (!TransportClass) {
      throw new Error(`${config.transport} is not a known method of fetching data. Consult Vudash docs.`)
    }

    return new TransportClass(config)
  }
}
