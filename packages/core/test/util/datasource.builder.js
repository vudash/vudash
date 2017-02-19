'use strict'

const Joi = require('joi')

class NonValidatingDataSource {
  constructor (options) {
    this.options = options
  }

  fetch () {
    return this.options
  }
}

class ValidatingDataSource extends NonValidatingDataSource {
  static get widgetValidation () {
    return Joi.object({}).required()
  }
}

class DatasourceBuilder {
  constructor () {
    this.ds = NonValidatingDataSource
  }

  addWidgetValidation () {
    this.ds = ValidatingDataSource
    return this
  }

  build () {
    return this.ds
  }
}

module.exports = {
  create: () => { return new DatasourceBuilder() }
}
