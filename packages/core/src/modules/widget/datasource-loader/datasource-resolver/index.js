'use strict'

const { WidgetRegistrationError } = require('../../../../errors')

class NoopDatasource {
  fetch () {
    return Promise.resolve()
  }
}

module.exports.resolve = function (datasources, datasource) {
  if (!datasource) { return new NoopDatasource() }

  const resolved = datasources[datasource]
  if (!resolved) {
    throw new WidgetRegistrationError(`Unable to use datasource ${datasource} as it does not exist`)
  }
  return resolved
}
