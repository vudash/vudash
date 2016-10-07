const RestTransport = require('./transports/rest')
const GoogleSheetsTransport = require('./transports/google-sheets')
const RandomTransport = require('./transports/random')
const ValueTransport = require('./transports/value')

const mappings = {
  'rest': RestTransport,
  'google-sheets': GoogleSheetsTransport,
  'random': RandomTransport,
  'value': ValueTransport
}

module.exports = {
  configure: (config) => {
    const TransportClass = mappings[config.source]

    if (!TransportClass) {
      throw new Error(`${config.source} is not a known method of fetching data. Consult Vudash docs.`)
    }

    return new TransportClass(config)
  }
}
