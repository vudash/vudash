'use strict'

export default {
  data () {
    return {
      description: '...',
      components: {},
      overallHealth: { class: 'healthy', ligature: 'lens' }
    }
  },

  methods: {
    update (data) {
      console.log(data)
      this.set(data)
    }
  }
}
