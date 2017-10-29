'use strict'

const { createEmitter } = require('./datasource-emitter')

exports.bind = function (datasource, schedule = 30000) {
  const emitter = createEmitter()

  function fetchFunction () {
    datasource
    .fetch()
    .then(data => {
      emitter.emit('update', data)
    })
  }

  fetchFunction()
  const timer = setInterval(fetchFunction, schedule)

  return {
    timer,
    emitter
  }
}
