'use strict'

export default {
  data () {
    return {
      description: 'Cloudflare',
      components: [
        { name: 'Africa', class: 'minor-outage', ligature: 'lens' },
        { name: 'Europe', class: 'Major Outage', ligature: 'panorama_fish_eye' },
        { name: 'Oceania', class: 'Healthy', ligature: 'tonality' }
      ],
      overallStatus: { class: 'healthy', ligature: 'lens' }
    }
  },

  methods: {
    update (data) {
      // this.set(data)
    }
  }
}
