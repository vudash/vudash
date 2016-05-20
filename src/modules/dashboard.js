'use strict'

const Widget = require('./widget')
const Path = require('path')

class Dashboard {

  constructor(descriptor) {
    this.widgets = descriptor.widgets.map((fd) => {
      const parts = fd.widget.split(':')
      switch(parts[0]) {
        case 'path':
          return new Widget(parts[1])
        default:
          throw new Error(`Widget descriptor ${fd.widget} was not understood.`)
      }
    })
  }

  getWidgets() {
    return this.widgets
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
