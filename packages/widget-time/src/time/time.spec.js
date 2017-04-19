'use strict'

const moment = require('moment')
const service = require('.')

describe('time', () => {
  it('without locale', async () => {
    const current = moment().tz('UTC').format('HH:mm:ss')
    const { time } = await service.time()
    expect(time).to.equal(current)
  })

  it('with locale', async () => {
    const timezone = 'America/Los_Angeles'
    const current = moment().tz('America/Los_Angeles').format('HH:mm:ss')
    const { time } = await service.time(timezone)
    expect(time).to.equal(current)
  })
})