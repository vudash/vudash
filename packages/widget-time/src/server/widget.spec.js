'use strict'

const { register } = require('./widget')
const { expect } = require('code')

describe('widget', () => {
  context('Alarms', () => {
    const config = {
      alarms: [
        {
          expression: '* * * * * *',
          actions: [
            {
              action: 'sound',
              options: {
                data: 'abcde'
              }
            }
          ]
        }
      ]
    }

    it('Allows alarm config', () => {
      expect(() => {
        register(config)
      }).not.to.throw()
    })
  })

  context('No alarms', () => {
    it('Allows config', () => {
      expect(() => {
        register({})
      }).not.to.throw()
    })
  })
})
