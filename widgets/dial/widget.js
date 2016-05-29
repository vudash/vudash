'use strict'

const defaults = {
  percentage: 27,
  description: 'Total Things'
}

class GaugeWidget {

  register (options) {
    const config = Object.assign({}, defaults, options)

    return {
      markup: 'markup.html',
      update: 'update.js',
      css: 'tk.audials.min.css',
      clientJs: ['tk.audials.min.js', 'client.js'],
      schedule: 3000,

      job: (emit) => {
        const random = Math.random() * (100 - 1) + 1
        const percentage = Math.floor(random)
        emit({ percentage, description: config.description })
      }

    }
  }

}

module.exports = GaugeWidget
