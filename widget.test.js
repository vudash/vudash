const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const context = lab.describe
const describe = lab.describe
const before = lab.before
const it = lab.it

const chance = require('chance')()

const Widget = require('./widget')

describe('widget', () => {
  context('Configuration', () => {
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
        colour: chance.color({ format: 'rgb' })
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

  })
})
