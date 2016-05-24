'use strict'

const Widget = require('./widget')

class Dashboard {
  constructor (descriptor, io) {
    this.io = io
    this.id = descriptor.name
    io.on('connection', (socket) => {
      socket.join(this.id)
      console.log(`Client ${socket.id} connected to ${this.id}`)
    })
    this.widgets = descriptor.widgets.map((fd) => {
      const parts = fd.widget.split(':')
      switch (parts[0]) {
        case 'path':
          return new Widget(parts[1])
        default:
          throw new Error(`Widget descriptor ${fd.widget} was not understood.`)
      }
    })
    this.buildJobs()
  }

  getWidgets () {
    return this.widgets
  }

  getJobs () {
    return this.jobs
  }

  _emit (id, data) {
    this.io.emit(`${id}:update`, data)
  }

  buildJobs () {
    this.jobs = this.getWidgets().map((widget) => {
      const job = widget.getJob()
      let self = this
      return setInterval(function () {
        job.script(self._emit.bind(self, widget.id))
      }, job.schedule)
    })
  }

  toRenderModel () {
    return {
      widgets: this.widgets.map((widget) => {
        return widget.toRenderModel()
      })
    }
  }

}

module.exports = Dashboard
