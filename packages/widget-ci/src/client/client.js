'use strict'

const icons = {
  passed: 'check_circle',
  failed: 'highlight_off',
  unknown: 'help_outline',
  running: 'update',
  queued: 'hourglass_empty'
}

export default {
  methods: {
    update (data) {
      let ligature = icons[data.status]
      let backgroundClass = data.status

      if (data.error) {
        ligature = 'block'
        backgroundClass = 'error'
      }

      this.set({ ligature, backgroundClass })
    }
  }
}

