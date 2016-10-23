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
    const config = { 'data-source': { source: 'value', config: { value: ['a', 'b'] } } }
    const widget = new Widget()
    const configuration = widget.register(config)
    return configuration
    .job()
    .then((output) => {
      expect(output).to.equal({ value: 'a,b' })
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
      const config = { 'format': '%d%%', 'data-source': { source: 'value', config: { value: 34 } } }
      const widget = new Widget()
      const configuration = widget.register(config)
      return configuration
      .job()
      .then((output) => {
        expect(output).to.equal({ value: '34%' })
      })
    })
  })
})
