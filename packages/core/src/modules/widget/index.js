'use strict'

const id = require('../id-gen')
const WidgetPosition = require('./widget-position')
const loader = require('./loader')
const renderer = require('./renderer')
const History = require('./history')

class Widget {
  constructor (widgetPath, config) {
    const { position, background, options = {}, history } = config

    this.id = id()
    this.widgetPath = widgetPath
    this.options = options
    this.background = background
    this.position = position
    this.history = History.create(history)
  }

  register (emitter) {
    const { widget, name, componentPath } = loader.load(this.widgetPath)
    this.componentPath = componentPath
    this.name = name

    this.widget = widget.register(this.options, emitter)
  }

  update (value) {
    return this.widget.update(value)
  }

  toRenderModel (dashboardLayout) {
    const {
      id,
      name,
      options,
      componentPath,
      background,
      position
    } = this

    const widgetPosition = new WidgetPosition(dashboardLayout, position)

    return {
      id,
      name,
      componentPath,
      markup: renderer.renderHtml(id),
      css: renderer.renderStyles(id, widgetPosition, background),
      js: renderer.renderScript(id, name, options)
    }
  }
}

exports.create = function (widgetPath, config) {
  return new Widget(widgetPath, config)
}
