'use strict'

class HealthWidget {
  constructor (options, emitter) {
    this.emitter = emitter
    this.on = false

    this.timer = setInterval(function () {
      this.run()
    }.bind(this), options.schedule || 1000)
    this.run()
  }

  run () {
    this.on = !this.on
    this.emitter.emit('update', { on: this.on })
  }

  destroy () {
    clearInterval(this.timer)
  }
}

exports.register = function (options, emitter) {
  return new HealthWidget(options, emitter)
}
