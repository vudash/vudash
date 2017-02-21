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
      this.set(data)
    }
  }
}
