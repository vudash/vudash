'use strict'

class ExampleWidget {

  register () {
    return {
      schedule: 1000,
      markup: 'markup.html',
      clientJs: 'client.js',
      css: 'style.css',
      update: 'update.js',

      job: (emit) => {
        emit({x: 'y'})
      }

    }
  }

}

module.exports = ExampleWidget
