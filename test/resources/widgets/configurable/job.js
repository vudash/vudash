'use strict'

const job = {
  schedule: 10000,
  register: function (config) {
    return (emit) => {
      return config
    }
  }
}

module.exports = job
