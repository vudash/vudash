'use strict'

module.exports = () => {
  const random = Math.random() * 0xFFFFFFFFFFFF << 0
  const positive = Math.abs(random)
  return positive.toString(16)
}
