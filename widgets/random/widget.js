'use strict'

class RandomWidget {

  register (options) {
    return {
      markup: 'markup.html',
      update: 'update.js',
      css: 'client.css',
      schedule: 5000,

      job: (emit) => {
        const random = Math.random() * (999 - 100) + 100
        const number = Math.floor(random)
        emit({number})
      }

    }
  }
}

module.exports = RandomWidget
