'use strict'

const Hapi = require('hapi')
const Hoek = require('hoek')
const server = new Hapi.Server()

const src = (name) => { return `./src/${name}` }
const plugin = (name) => { return src(`plugins/${name}`) }

server.connection({ port: process.env.PORT || 3300 })

server.register([
  require('vision'),
  require('inert'),
  require(plugin('socket')),
  require(plugin('static')),
  require(plugin('dashboard'))
], (err) => {
  Hoek.assert(!err, err)

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: src('views')
  })

  server.start((err) => {
    Hoek.assert(!err, err)

    console.log('Server running at:', server.info.uri)
  })
})

module.exports = server
