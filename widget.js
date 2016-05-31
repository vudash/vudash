'use strict'

const Travis = require('travis-ci')

class TravisWidget {

  constructor () {
    this.travis = new Travis({
      version: '2.0.0'
    })
  }

  register (options) {
    const defaultConfig = {
      user: 'vudash',
      repo: 'vudash-core'
    }
    const config = Object.assign({}, defaultConfig, options)

    return {
      config,
      schedule: 60000,
      markup: 'markup.html',
      update: 'update.js',
      clientJs: 'client.js',

      job: (emit) => {
        this.travis.repos(config.user, config.repo).builds().get((err, res) => {
          let state
          if (err || !res.builds || !res.builds.length) {
            state = 'unknown'
          } else {
            state = res.builds[0].state
          }
          emit({state})
        })
      }
    }
  }

}

module.exports = TravisWidget
