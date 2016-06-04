'use strict'

const Widget = require('./widget')
const Emitter = require('./emitter')
const id = require('./id-gen')

class Dashboard {
  constructor (descriptor, io) {
    this.id = id()
    this.name = descriptor.name
    this.emitter = new Emitter(io, this.id)
    this.widgets = descriptor.widgets.map((row) => {
      return row.map((fd) => {
        return new Widget(fd.widget, fd.options)
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

  buildJobs () {
    const widgets = this.getWidgets().reduce((all, next) => { return all.concat(next) }, [])
    this.jobs = widgets.map((widget) => {
      const job = widget.getJob()
      if (job) {
        let self = this
        const fn = function () {
          job.script(self.emitter.emit.bind(self.emitter, widget.id))
        }
        setTimeout(fn(), 5000)
        return setInterval(fn, job.schedule)
      }
    })
  }

  toRenderModel () {
    return {
      name: this.name,
      widgets: this.getWidgets().map((row) => {
        return row.map((widget) => {
          return widget.toRenderModel()
        })
      })
    }
  }

}

module.exports = Dashboard
