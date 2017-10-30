'use strict'

class HealthWidget {
  constructor () {
    this.on = false
  }

  update () {
    this.on = !this.on
    return this.on
  }
}

exports.register = function (options) {
  return new HealthWidget(options)
}
