'use strict'

const { WidgetRegistrationError } = require('../../../errors')

exports.locate = function (datasources, datasource) {
  const resolved = datasources[datasource]

  if (!resolved) {
    throw new WidgetRegistrationError(`Unable to use datasource ${datasource} as it does not exist`)
  }
  
  return resolved
}
