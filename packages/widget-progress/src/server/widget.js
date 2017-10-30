'use strict'

class ProgressWidget {
  constructor (options) {
    this.config = options
  }

  update (data) {
    let percentage = data
    if (data < 0) { percentage = 0 }
    if (data > 100) { percentage = 100 }
    return { percentage }
  }
}

exports.register = function (options) {
  return new ProgressWidget(options)
}
