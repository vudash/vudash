'use strict'

const dashboardLoader = require('modules/dashboard/loader')
const Boom = require('boom')

module.exports = function (request, reply) {
  const { board, datasourceId } = request.params
  const { dashboards } = request.server.plugins.ui

  try {
    const dashboard = dashboardLoader.find(dashboards, board)
    const datasource = dashboard.getDatasource(datasourceId)

    const update = datasource.update
    if (update && typeof update === 'function') {
      update(request.payload)
      reply()
    }

    throw new Error(`Datasource ${board}/${datasourceId} does not allow update via the API`)
  } catch (e) {
    reply(Boom.badRequest(e))
  }
}
