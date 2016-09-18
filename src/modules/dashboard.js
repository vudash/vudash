'use strict'

const Widget = require('./widget')
const Emitter = require('./emitter')
const id = require('./id-gen')

class Dashboard {
  constructor (descriptor, io) {
    this.id = id()
    this.name = descriptor.name
    this.emitter = new Emitter(io, this.id)
    this.layout = descriptor.layout
    this.widgets = descriptor.widgets.map((fd) => {
      return new Widget(this, fd.position, fd.widget, fd.options)
    })
    this.buildJobs()
  }

  getWidgets () {
    return this.widgets
  }

  getJobs () {
    return this.jobs
  }

  buildJobs () {
    this.jobs = this.getWidgets().map((widget) => {
      const job = widget.getJob()
      if (job) {
        let self = this
        const fn = function () {
          job.script(self.emitter.emit.bind(self.emitter, widget.id))
        }
        setTimeout(fn, 5000)
        return setInterval(fn, job.schedule)
      }
    })
  }

  toRenderModel () {
    return {
      name: this.name,
      widgets: this.getWidgets().map((widget) => {
        return widget.toRenderModel()
      })
    }
  }

}

module.exports = Dashboard
