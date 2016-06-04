'use strict'

const shortid = require('shortid')
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_')

module.exports = () => {
  return shortid.generate().replace(/-/, '_')
}
