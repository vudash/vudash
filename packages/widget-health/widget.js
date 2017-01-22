const Promise = require('bluebird').Promise

class HealthWidget {

  register (options) {
    let on = false

    return {
      schedule: 1000,

      job: () => {
        on = !on
        const classes = on ? '' : 'small'
        return Promise.resolve({ classes })
      }

    }
  }

}

module.exports = HealthWidget
