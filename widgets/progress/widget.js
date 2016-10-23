const Promise = require('bluebird').Promise

const defaults = {
  percentage: 27,
  description: 'Total Things'
}

class ProgressWidget {

  register (options) {
    const config = Object.assign({}, defaults, options)

    return {
      config,
      markup: 'markup.html',
      update: 'update.js',
      css: 'style.css',
      schedule: 3000,

      job: () => {
        const random = Math.random() * (100 - 1) + 1
        const percentage = Math.floor(random)
        return Promise.resolve({ percentage, description: config.description })
      }
    }
  }

}

module.exports = ProgressWidget
