'use strict'

const requirePaths = require('app-module-path')
requirePaths.addPath(process.cwd())
requirePaths.addPath(`${process.cwd()}/node_modules`)

const Hapi = require('hapi')
const Hoek = require('hoek')
const server = new Hapi.Server()
const fs = require('fs')
const Path = require('path')
const chalk = require('chalk')

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

    if (process.env.BROWSER_SYNC) {
      const bs = require('browser-sync').create()

      bs.init({
        open: false,
        proxy: server.info.uri,
        files: ['src/public/**/*.{js,css}']
      })
    }
    console.log('Server', 'running'.green)
    console.log('Dashboards available:')
    const dashboardDir = Path.join(process.cwd(), 'dashboards')
    const boards = fs.readdirSync(dashboardDir)
    for (let board of boards) {
      const loaded = require(Path.join(dashboardDir, board))
      const boardUrl = `${Path.basename(board, '.json')}.dashboard`
      console.log(chalk.blue.bold(loaded.name), 'at', chalk.cyan.underline(`${server.info.uri}/${boardUrl}`))
    }
  })
})

module.exports = server
