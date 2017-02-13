'use strict'

const { WidgetRegistrationError } = require('../../../errors')

module.exports.resolve = function (datasources, datasource) {
  if (!datasource) { return () => { return Promise.resolve() } }

  const resolved = datasources[datasource]
  if (!resolved) {
    throw new WidgetRegistrationError(`Unable to use datasource ${datasource} as it does not exist`)
  }
  return resolved
}
