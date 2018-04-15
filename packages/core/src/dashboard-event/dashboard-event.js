'use strict'

exports.build = function (data) {
  return {
    meta: {
      updated: new Date()
    },
    data
  }
}
