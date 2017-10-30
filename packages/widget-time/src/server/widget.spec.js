'use strict'

const { register } = require('./widget')
const { expect } = require('code')
const { stub } = require('sinon')

describe('widget', () => {
  context('Alarms', () => {
    let widget

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
         widget = register(config, { emit: stub() })
      }).not.to.throw()
    })

    afterEach(() => {
      widget.destroy()
    })
  })

  context('No alarms', () => {
    let widget

    it('Allows config', () => {
      expect(() => {
        widget = register({}, { emit: stub() })
      }).not.to.throw()
    })

    afterEach(() => {
      widget.destroy()
    })
  })

  context('#destroy()', () => {
    let widget

    const action1 = { stop: stub() }
    const action2 = { stop: stub() }

    beforeEach(() => {
      widget = register({}, { emit: stub() })
      widget.alarms = [
        [
          action1,
          action2
        ]
      ]
    })

    it('calls stop on all actions', () => {
      widget.destroy()
      expect(action1.stop.callCount).to.equal(1)
      expect(action2.stop.callCount).to.equal(1)
    })

    afterEach(() => {
      widget.destroy()
    })
  })
})
