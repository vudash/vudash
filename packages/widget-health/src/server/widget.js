'use strict'

class HealthWidget {
  constructor (options, emitter) {
    this.emitter = emitter
    this.on = false

    this.timer = setInterval(function () {
      this.run()
    }.bind(this), this.config.schedule)
    this.run()
  }

  run () {
    this.on = !this.on
    this.emitter.emit('update', this.on)
  }

  destroy () {
    clearInterval(this.timer)
  }
}

exports.register = function (options) {
  return new HealthWidget(options)
}
