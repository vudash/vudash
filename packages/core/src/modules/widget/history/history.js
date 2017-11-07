'use strict'

class History {
  constructor (size = 10) {
    this.size = size
    this.items = []
  }

  insert (entry) {
    this.items.push(entry)
    if (this.items.length > this.size) {
      this.items.shift()
    }
  }

  fetch () {
    return this.items
  }
}

exports.create = function (size) {
  return new History(size)
}
