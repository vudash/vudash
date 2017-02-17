'use strict'

const Joi = require('joi')

class DatasourceBuilder {
  constructor () {
    this.ds = function (options) { this.options = options }
    this.ds.prototype.fetch = function () { return this.options }
  }

  addWidgetValidation () {
    this.ds.widgetValidation = function () {
      return Joi.object({}).required()
    }
    return this
  }

  build () {
    return this.ds
  }
}

module.exports = {
  create: () => { return new DatasourceBuilder() }
}
