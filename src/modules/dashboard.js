'use strict'

const Widget = require('./widget')
const Path = require('path')

class Dashboard {

  constructor(descriptor, emit) {
    this.emit = emit
    this.widgets = descriptor.widgets.map((fd) => {
      const parts = fd.widget.split(':')
      switch(parts[0]) {
        case 'path':
          return new Widget(parts[1])
        default:
          throw new Error(`Widget descriptor ${fd.widget} was not understood.`)
      }
    })
    this.buildJobs()
  }

  getWidgets() {
    return this.widgets
  }

  getJobs() {
    return this.jobs
  }

  buildJobs() {
    this.jobs = this.getWidgets().map((widget) => {
      return setInterval(function() {
        var self = this;
        function emit (data) {
          self.emit(`${widget.id}:update`, data)
        }
        widget.job.script(emit)
      }.bind(this), widget.schedule)
    })
  }

  toRenderModel() {
    return {
      widgets: this.widgets.map((widget) => {
        return widget.toRenderModel()
      })
    }
  }

}

module.exports = Dashboard
