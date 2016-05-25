module.exports = {

  script: (emit) => {
    emit({x: 'y'})
  },

  schedule: 1000,

  config: {
    foo: 'bar',
    working: false
  }

}
