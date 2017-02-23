'use strict'

const Widget = require('../../widget')

class WidgetConstructor {

  constructor (dashboard) {
    this.dashboard = dashboard
  }

  register (fd) {
    return new Widget(this.dashboard, {
      position: fd.position,
      background: fd.background,
      datasource: fd.datasource
    }, fd.widget, fd.options)
  }

}

module.exports = WidgetConstructor
