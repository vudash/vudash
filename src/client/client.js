export default {
  data () {
    return {
      time: '--:--:--',
      date: '--- -- --- ----'
    }
  },

  methods: {
    update (data) {
      this.set(data)
    }
  }
}