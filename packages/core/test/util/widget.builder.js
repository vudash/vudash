'use strict'

const { Promise } = require('bluebird')

class WidgetBuilder {
  constructor () {
    this.widget = this._createWidgetModule()
    this.position = { x: 0, y: 0, w: 0, h: 0 }
  }

  _createWidgetModule (internals = { schedule: 1000, job: () => { return Promise.resolve({}) } }) {
    const Module = class MyWidget {
      register (options) {
        return Object.assign({}, internals, { config: options })
      }
    }
    const html = '<h1>hi</h1>'
    const name = 'VudashMyWidget'

    return {
      Module,
      html,
      name
    }
  }

  withJob (job = Promise.resolve({}), schedule = 1000) {
    this.widget = this._createWidgetModule({ job, schedule })
    return this
  }

  withOptions (options = {}) {
    this.options = options
    return this
  }

  withWidget (widget) {
    this.widget = widget
    return this
  }

  build () {
    return {
      position: this.position,
      widget: this.widget,
      options: this.options
    }
  }
}

module.exports = {
  create: () => { return new WidgetBuilder() }
}
