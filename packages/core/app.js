'use strict'

const { register, start, stop } = require('./src/server')

async function init () {

  const server = await register()
  await start(server)

  process.on('SIGUSR2', async () => {
    await stop(server)
    process.exit()
  })
}

init()