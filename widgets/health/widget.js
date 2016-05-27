'use strict'

class HealthWidget {

  register (options) {

    let on = false

    return {
      markup: 'markup.html',
      update: 'update.js',
      schedule: 1000,

      job: (emit) => {
        on = !on
        emit({on})
      }

    }

  }

}

module.exports = HealthWidget
