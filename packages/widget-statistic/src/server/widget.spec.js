'use strict'

const { expect } = require('code')
const Widget = require('./widget')
const { stub } = require('sinon')

describe('widget', () => {
  it('Uses config', () => {
    const config = { schedule: 25000 }
    const widget = new Widget()
    const configuration = widget.register(config)
    expect(configuration.schedule).to.equal(config.schedule)
  })

  it('Will convert given value to string', () => {
    const transport = { fetch: stub().resolves([1, 2]) }
    const widget = new Widget()
    const configuration = widget.register({}, null, transport)
    return configuration
    .job()
    .then((output) => {
      expect(output.value).to.equal('2')
    })
  })

  context('Formatting', () => {
    it('Will use default format value if none specified', () => {
      const transport = { fetch: stub().resolves('things') }
      const widget = new Widget()
      const configuration = widget.register({}, null, transport)
      return configuration
      .job()
      .then((output) => {
        expect(output).to.equal({ value: 'things' })
      })
    })

    it('Will format according to format config', () => {
      const transport = { fetch: stub().resolves(34) }
      const widget = new Widget()
      const configuration = widget.register({ format: '%d%%' }, null, transport)
      return configuration
      .job()
      .then((output) => {
        expect(output).to.equal({ value: '34%' })
      })
    })
  })

  context('Colours', () => {
    it('With provided colour', () => {
      const conf = { colour: '#fff' }
      const widget = new Widget()
      const { config } = widget.register(conf)
      expect(config.colour).to.equal('#fff')
    })

    it('No colour passed', () => {
      const widget = new Widget()
      const { config } = widget.register({})
      expect(config.colour).not.to.exist()
    })
  })

  context('Arrays', () => {
    it("if it's an array, provide params for a graph", () => {
      const values = [1, 2, 3, 4, 5, 6, 7]
      const transport = { fetch: stub().resolves(values) }
      const widget = new Widget()
      const configuration = widget.register({}, null, transport)
      return configuration
      .job()
      .then((output) => {
        expect(output.value).to.equal('7')
        expect(output.history).to.equal(values)
      })
    })
  })
})
