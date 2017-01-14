'use strict'

export default {
  data () {
    return {
      config: {},
      value: 100,
    }
  },

  computed: {
    pipSize: (config) => {
      const range = config.max - config.min
      return range / 100
    },
    degrees: (pipSize, value) => {
      const percentage = pipSize * (value / 100)
      return ( 180 / 100 ) * percentage
    },
    pointerDegrees: (degrees, value) => {
      return degrees - 90
    }
  },

  methods: {
    update (data) {
      this.set(data)
    }
  }
}