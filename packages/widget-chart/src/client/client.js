import Chartist from 'chartist'

export default {
  data () {
    return [
      [12, 9, 7, 8, 5],
      [2, 1, 3.5, 7, 3],
      [1, 3, 4, 5, 6]
    ]
  },

  methods: {
    oncreate () {
      console.log(this.refs.chart)
      this.chart = new Chartist.Line(this.refs.chart, {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: this.get('series')
      }, {
        fullWidth: true,
        chartPadding: {
          right: 40
        }
      })
    },

    update (data) {
      this.set({ series: data })
    }
  }
}
