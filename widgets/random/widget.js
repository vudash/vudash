const Promise = require('bluebird').Promise

class RandomWidget {

  register (options) {
    return {
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      schedule: 5000,

      job: () => {
        const random = Math.random() * (999 - 100) + 100
        const number = Math.floor(random)
        return Promise.resolve({number})
      }

    }
  }
}

module.exports = RandomWidget
