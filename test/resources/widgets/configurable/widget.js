'use strict'

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

      job: (emit) => {
        return config
      }
    }
  }
}

module.exports = ConfigurableWidget
