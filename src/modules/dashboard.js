'use strict'

const Widget = require(fromSrc('modules/widget'))

class Dashboard {

  constructor(descriptor) {
    this.widgets = descriptor.widgets.map((fd) => {
      const parts = fd.widget.split(':')
      switch(parts[0]) {
        case 'internal':
          return new Widget(fromRoot(`widgets/${parts[1]}`))
        default:
          throw new Error(`Widget descriptor ${fd.widget} was not understood.`)
      }
    })
  }

  getWidgets() {
    return this.widgets
  }

}

module.exports = Dashboard
