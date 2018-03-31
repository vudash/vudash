'use strict'

const requirePaths = require('app-module-path')
requirePaths.addPath(process.cwd())
requirePaths.addPath(`${process.cwd()}/node_modules`)

const Hapi = require('hapi')
const fs = require('fs')
const Path = require('path')
const chalk = require('chalk')
const unhandled = require('unhandled-rejection')
const id = require('./modules/id-gen')

const rejectionEmitter = unhandled({
  timeout: 5
})

rejectionEmitter.on('unhandledRejection', (error, promise) => {
  console.error(error)
})

function register () {
  const server = new Hapi.Server()
  server.connection({ port: process.env.PORT || 3300 })

  const apiKey = process.env['API_KEY'] || id()

  return server.register([
    require('vision'),
    require('inert'),
    require('./plugins/socket'),
    require('./plugins/static'),
    require('./plugins/ui'),
    {
      register: require('hapi-api-secret-key').plugin,
      options: {
        secrets: [ apiKey ]
      }
    },
    require('./plugins/api')
  ])
  .then(() => {
    server.views({
      engines: {
        html: require('handlebars')
      },
      relativeTo: __dirname,
      path: './views'
    })

    console.log(`Loading dashboards from ${chalk.blue(process.cwd())}`)
    console.log(`Server ${chalk.green.bold('running')}`)
    console.log(`Api key: ${chalk.magenta.bold(apiKey)}`)
    console.log('Dashboards available:')
    const dashboardDir = Path.join(process.cwd(), 'dashboards')
    const boards = fs.readdirSync(dashboardDir)
    for (let board of boards) {
      const loaded = require(Path.join(dashboardDir, board))
      const boardUrl = `${Path.basename(board, '.json')}.dashboard`
      console.log(chalk.blue.bold(loaded.name), 'at', chalk.cyan.underline(`${server.info.uri}/${boardUrl}`))
    }

    return Promise.resolve(server)
  })
}

function start (server) {
  return server.start()
  .then(() => {
    if (process.env.BROWSER_SYNC) {
      const bs = require('browser-sync').create()

      bs.init({
        open: false,
        proxy: server.info.uri,
        files: ['src/public/**/*.{js,css}']
      })
    }

    return Promise.resolve()
  })
}

function cleanup (server) {
  const cache = Object.values(server.plugins.ui.dashboards)
  cache.forEach(dashboard => {
    dashboard.destroy()
  })
}

function stop (server) {
  server.stop({
    timeout: 60000
  }, () => {
    cleanup(server)
    return Promise.resolve()
  })
}

module.exports = {
  register,
  start,
  stop
}
