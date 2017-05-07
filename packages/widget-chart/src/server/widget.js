'use strict'

const defaults = {
  description: '',
  schedule: 60 * 1000 * 5,
  labels: [],
  type: 'line'
}

class ChartWidget {

  register (options, emit, transport) {
    const config = Object.assign({}, defaults, options)

    return {
      schedule: config.schedule,
      config,

      job: () => {
        return transport
        .fetch()
        .then(result => {
          const names = Object.keys(result)
          const series = names.map(names => {
            return result[names]
          })
          return { series }
        })
      }
    }
  }

}

module.exports = ChartWidget
