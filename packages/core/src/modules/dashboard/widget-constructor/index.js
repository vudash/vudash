'use strict'

const Widget = require('../../widget')
const { reach } = require('hoek')
const defaultsDeep = require('lodash/defaultsDeep')

const internals = {
  getSharedConfig: function (sharedConfig, key) {
    if (!key) { return {} }

    const conf = sharedConfig[key]
    if (!conf) {
      throw new Error(`Shared configuration ${key} does not exist.`)
    }

    return conf
  },

  extendSharedConfig: function (baseConfiguration, options) {
    const extended = defaultsDeep({}, baseConfiguration, options)
    delete extended._extends
    return extended
  }
}

class WidgetConstructor {

  constructor (dashboard, sharedConfig = {}) {
    this.dashboard = dashboard
    this.sharedConfig = sharedConfig
  }

  register (fd) {
    const inheritFrom = reach(fd, 'options._extends', { default: false })
    const baseConfiguration = internals.getSharedConfig(this.sharedConfig, inheritFrom)
    const options = baseConfiguration ? internals.extendSharedConfig(baseConfiguration, fd.options) : fd.options

    return new Widget(this.dashboard, {
      position: fd.position,
      background: fd.background,
      datasource: fd.datasource
    }, fd.widget, options)
  }

}

module.exports = WidgetConstructor
