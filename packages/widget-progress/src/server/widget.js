'use strict'

const defaults = {
  description: 'Completion',
  schedule: 30000
}

class ProgressWidget {
  constructor (options) {
    this.config = Object.assign({}, defaults, options)
  }

  update (percentage) {
    if (percentage < 0) { percentage = 0 }
    if (percentage > 100) { percentage = 100 }
    return { percentage }
  }
}

exports.register = function (options) {
  return new ProgressWidget(options)
}
