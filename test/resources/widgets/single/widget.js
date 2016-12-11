const Promise = require('bluebird').Promise

class ExampleWidget {

  register () {
    return {
      schedule: 1000,
      markup: 'markup.html',
      clientJs: 'client.js',
      css: 'style.css',
      update: 'update.js',

      job: () => {
        return Promise.resolve({x: 'y'})
      }

    }
  }

}

module.exports = ExampleWidget
