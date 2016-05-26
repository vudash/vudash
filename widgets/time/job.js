const moment = require('moment')

module.exports = {
  register: (config) => {
    return (emit) => {
      const now = moment()
      emit({time: now.format('HH:mm:ss'), date: now.format('MMMM Do YYYY')})
    }
  },
  schedule: 1000
}
