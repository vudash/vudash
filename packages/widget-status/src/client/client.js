'use strict'

export default {
  data () {
    return {
      description: '...',
      components: [
      ],
      overallStatus: { class: 'healthy', ligature: 'lens' }
    }
  },

  methods: {
    update (data) {
      this.set(data)
    }
  }
}
