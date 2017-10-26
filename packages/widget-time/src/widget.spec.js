'use strict'

const Widget = require('./widget')
const { expect } = require('code')

describe('widget', () => {
  context('Alarms', () => {
    let widget
    before(() => {
      widget = new Widget()
      
    })

    it('Allows alarm config', () => {
      const fn = () => {
        widget.register({
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
        })
      }

      expect(fn).not.to.throw()
      
    })
  })

  context('No alarms', () => {
    let widget
    before(() => {
      widget = new Widget()
      
    })

    it('Allows config', () => {
      const fn = () => {
        widget.register({})
      }

      expect(fn).not.to.throw()
      
    })
  })
})
