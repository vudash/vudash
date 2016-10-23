const Promise = require('bluebird').Promise

const defaults = {
  foo: 'bar',
  working: false
}

class ConfigurableWidget {

  register (options) {
    const config = Object.assign({}, defaults, options)

    return {
      config,
      schedule: 10000,

      job: () => {
        return Promise.resolve(config)
      }
    }
  }
}

module.exports = ConfigurableWidget
