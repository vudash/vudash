'use strict'

const chance = require('chance')()

const Widget = require('./widget')

describe('widget', () => {
  context('All Configuration Options', () => {
    let widget

    const config = {
      schedule: chance.natural(),
      'initial-value': chance.integer({min: 0, max: 100}),
      min: chance.integer({min: 0, max: 100}),
      max: chance.integer({min: 0, max: 100}),
      description: chance.word(),
      pointer: {
        'background-colour': chance.color(),
        colour: chance.word()
      },
      value: {
        'font-size': `${chance.integer({min: 0, max: 100})}px`,
        colour: chance.color({ format: 'rgb' }),
        'background-colour': chance.color()
      }
    }

    before((done) => {
      widget = new Widget().register(config)
      done()
    })

    it('Overrides schedule', (done) => {
      expect(widget.schedule).to.equal(config.schedule)
      done()
    })

    it('Overrides initial value', (done) => {
      expect(widget.config.value).to.equal(config['initial-value'])
      done()
    })

    it('Overrides minimum value', (done) => {
      expect(widget.config.min).to.equal(config.min)
      done()
    })

    it('Overrides maximum value', (done) => {
      expect(widget.config.max).to.equal(config.max)
      done()
    })

    it('Overrides description', (done) => {
      expect(widget.config.description).to.equal(config.description)
      done()
    })

    it('Overrides pointer background colour', (done) => {
      expect(widget.config.indicatorBackgroundColour).to.equal(config.pointer['background-colour'])
      done()
    })

    it('Overrides pointer background colour', (done) => {
      expect(widget.config.indicatorColour).to.equal(config.pointer['colour'])
      done()
    })

    it('Overrides value background colour', (done) => {
      expect(widget.config.valueBackgroundColour).to.equal(config.value['background-colour'])
      done()
    })

    it('Overrides value colour', (done) => {
      expect(widget.config.valueColour).to.equal(config.value['colour'])
      done()
    })

    it('Overrides value font size', (done) => {
      expect(widget.config.valueFontSize).to.equal(config.value['font-size'])
      done()
    })
  })

  context('Configuration Defaults', () => {
    let widget

    const config = {
      schedule: 32768
    }

    before((done) => {
      widget = new Widget().register(config)
      done()
    })

    it('Overrides schedule', (done) => {
      expect(widget.schedule).to.equal(32768)
      done()
    })
  })
})
