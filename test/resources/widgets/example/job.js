'use strict'

module.exports = {
  register: (config) => {
    return (emit) => {
      emit({x: 'y'})
    }
  },
  schedule: 1000
}
