'use strict'

let on = false

module.exports = {
  script: function (emit) {
    on = !on
    emit({on})
  },

  schedule: 1000

}
