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

    this.widgets = descriptor.widgets.map((row) => {
      return row.map((fd) => {
        const parts = fd.widget.split(':')
        switch (parts[0]) {
          case 'path':
            return new Widget(parts[1], fd.options)
          default:
            throw new Error(`Widget descriptor ${fd.widget} was not understood.`)
        }
      })
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
    this.io.to(this.id).emit(`${id}:update`, data)
  }

  buildJobs () {
    const widgets = this.getWidgets().reduce((all, next) => { return all.concat(next) }, [])
    this.jobs = widgets.map((widget) => {
      const job = widget.getJob()
      if (job) {
        let self = this
        const fn = function () {
          job.script(self._emit.bind(self, widget.id))
        }
        fn()
        return setInterval(fn, job.schedule)
      }
    })
  }

  toRenderModel () {
    return {
      widgets: this.getWidgets().map((row) => {
        return row.map((widget) => {
          return widget.toRenderModel()
        })
      })
    }
  }

}

module.exports = Dashboard
