const Promise = require('bluebird').Promise

class HealthWidget {

  register (options) {
    let on = false

    return {
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      schedule: 1000,

      job: () => {
        on = !on
        return Promise.resolve({on})
      }

    }
  }

}

module.exports = HealthWidget
