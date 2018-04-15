'use strict'

const { register, start, stop } = require('./src/server')

let server

register()
  .then(registered => {
    server = registered
    start(server)
  })

process.on('SIGUSR2', () => {
  stop(server)
    .then(() => {
      process.exit()
    })
})
