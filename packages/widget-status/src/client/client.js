'use strict'

const mappings = {
  error: 'sentiment_very_dissatisfied',
  good: 'sentiment_satisfied',
  minor: 'sentiment_neutral',
  major: 'sentiment_dissatisfied'
}

export default {
  data () {
    return {
      ligature: 'schedule'
    }
  },

  methods: {
    update (data) {
      const ligature = mappings[data.status]
      this.set(data)
      this.set({
        ligature
      })
    }
  }
}
