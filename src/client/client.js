'use strict'

const options = {
  axisX: {
    showLabel: false,
    showGrid: false
  },
  axisY: {
    showLabel: false,
    showGrid: false
  },
  showPoint: false,
  showArea: true,
  fullWidth: true,
  width: '100%'
}

export default {
  data () {
    return {
      history: []
    }
  },

  methods: {
    update (data) {
      if (data.history) {
        const chartData = {
          series: [
            { data: data.history }
          ]
        }
        this.chart = new Chartist.Line(this.refs.chart, chartData, options)
      }

      this.set(data)
    }
  }
}