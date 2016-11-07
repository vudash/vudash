'use strict'

const Widget = require('./widget')

describe('widget', () => {
  context('Alarms', (done) => {
    let widget
    before((done) => {
      widget = new Widget()
      done()
    })

    it('Allows alarm config', (done) => {
      const fn = () => {
        widget.register({
          alarms: [
            {
              expression: '* * * * * *',
              actions: [
                {
                  action: 'sound',
                  options: {
                    file: 'sound.ogg'
                  }
                }
              ]
            }
          ]
        })
      }

      expect(fn).not.to.throw()
      done()
    })
  })

  context('No alarms', (done) => {
    let widget
    before((done) => {
      widget = new Widget()
      done()
    })

    it('Allows config', (done) => {
      const fn = () => {
        widget.register({})
      }

      expect(fn).not.to.throw()
      done()
    })
  })
})
