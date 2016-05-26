'use strict'

let on = false

module.exports = {
  register: (config) => {
    return (emit) => {
      on = !on
      emit({on})
    }
  },
  schedule: 1000
}
