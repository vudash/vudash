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
  }

  initialise () {
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
        let executeJob = this.emitResult.bind(this, widget, this.emitter)
        executeJob()
        return setInterval(executeJob, job.schedule)
      }
    })
  }

  emitResult (widget, emitter) {
    return widget.getJob().script().then((result) => {
      result._updated = new Date()
      emitter.emit(widget.id, result)
    })
    .catch((err) => {
      console.error(`Error in widget ${widget.descriptor} (${widget.id})`, err)
      emitter.emit(widget.id, { error: { message: err.message } })
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
