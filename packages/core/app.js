'use strict'

const { register, start } = require('./src/server')

register()
.then(server => {
  start(server)
})
