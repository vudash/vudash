const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const context = lab.describe
const describe = lab.describe
const it = lab.it

const Widget = require('./widget')

describe('widget', () => {
  it('Uses config', (done) => {
    const config = { schedule: 25000 }
    const widget = new Widget()
    const configuration = widget.register(config)
    expect(configuration.schedule).to.equal(config.schedule)
    done()
  })

  it('Will convert given value to string', () => {
    const config = { 'data-source': { source: 'value', config: { value: [1, 2] } } }
    const widget = new Widget()
    const configuration = widget.register(config)
    return configuration
    .job()
    .then((output) => {
      expect(output.value).to.equal('2')
    })
  })

  context('Formatting', () => {
    it('Will use default format value if none specified', () => {
      const config = { 'data-source': { source: 'value', config: { value: 'things' } } }
      const widget = new Widget()
      const configuration = widget.register(config)
      return configuration
      .job()
      .then((output) => {
        expect(output).to.equal({ value: 'things' })
      })
    })

    it('Will format according to format config', () => {
      const config = { format: '%d%%', 'data-source': { source: 'value', config: { value: 34 } } }
      const widget = new Widget()
      const configuration = widget.register(config)
      return configuration
      .job()
      .then((output) => {
        expect(output).to.equal({ value: '34%' })
      })
    })
  })

  context('Arrays', () => {
    it("if it's an array, provide params for a graph", () => {
      const config = { format: '%s', 'data-source': { source: 'value', config: { value: [1,2,3,4,5,6,7] } } }
      const widget = new Widget()
      const configuration = widget.register(config)
      return configuration
      .job()
      .then((output) => {
        expect(output.value).to.equal('7')
        expect(output.history).to.equal([1,2,3,4,5,6])
      })
    })
  })
})
