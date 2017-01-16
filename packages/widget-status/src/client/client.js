'use strict'

export default {
  data () {
    return {
      description: 'Cloudflare',
      components: [
        { name: 'Africa', status: 'Minor Outage' },
        { name: 'Europe', status: 'Major Outage' },
        { name: 'Oceania', status: 'Healthy' }
      ],
      overallStatus: 'Minor Outage'
    }
  },

  methods: {
    update (data) {
      // this.set(data)
    }
  }
}
