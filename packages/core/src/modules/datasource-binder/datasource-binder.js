'use strict'

const { createEmitter } = require('./datasource-emitter')
const chalk = require('chalk')

exports.bind = function (name, datasource, schedule = 30000) {
  const emitter = createEmitter()

  function fetchFunction () {
    datasource
      .fetch()
      .then(data => {
        emitter.emit('update', data)
      })
      .catch(e => {
        console.error(chalk.red.bold(`Error updating datasource ${name}`), chalk.yellow(e.message))
        console.error(chalk.red(e.stack))
      })
  }

  const timer = setInterval(fetchFunction, schedule)

  fetchFunction()

  return {
    timer,
    emitter
  }
}
