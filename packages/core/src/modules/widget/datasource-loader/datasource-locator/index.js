'use strict'

const { WidgetRegistrationError } = require('../../../../errors')

class NoopDatasource {
  fetch () {
    return Promise.resolve()
  }
}

module.exports.locate = function (datasources, datasource) {
  if (!datasource) { return { Constructor: NoopDatasource } }

  const resolved = datasources[datasource]

  if (!resolved) {
    throw new WidgetRegistrationError(`Unable to use datasource ${datasource} as it does not exist`)
  }
  return resolved
}
