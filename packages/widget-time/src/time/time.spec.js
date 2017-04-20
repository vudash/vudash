'use strict'

const moment = require('moment-timezone')
const service = require('.')

describe('time', () => {
  it('with UTC locale', async () => {
    const timezone = 'UTC'
    const current = moment().tz(timezone).format('HH:mm:ss')
    const { time } = await service.time(timezone)
    expect(time).to.equal(current)
  })

  it('with locale', async () => {
    const timezone = 'America/Los_Angeles'
    const current = moment().tz(timezone).format('HH:mm:ss')
    const { time } = await service.time(timezone)
    expect(time).to.equal(current)
  })
})