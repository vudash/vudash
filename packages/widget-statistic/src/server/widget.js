const sprintf = require('sprintf-js').sprintf

const defaults = {
  'description': 'Statistics',
  'schedule': 60000,
  'format': '%s'
}

class StatisticWidget {

  register (options, transport) {
    const config = this.config = Object.assign({}, defaults, options)
    this.transport = transport

    return {
      config: { description: config.description },
      schedule: config.schedule,

      job: this.job.bind(this)
    }
  }

  job () {
    return this.transport
    .fetch()
    .then((result) => {
      if (Array.isArray(result)) {
        const currentValue = result.pop()
        return { value: this._format(currentValue), history: result }
      }

      return { value: this._format(result) }
    })
  }

  _format (value) {
    return sprintf(this.config.format, value)
  }

}

module.exports = StatisticWidget
