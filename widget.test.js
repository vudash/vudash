const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')

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
    const emitMock = sinon.spy()
    const config = { 'data-source': { source: 'value', config: { value: ['a', 'b'] } } }
    const widget = new Widget()
    const configuration = widget.register(config)
    return configuration
    .job(emitMock)
    .then(() => {
      expect(emitMock.called).to.equal(true)
      expect(emitMock.firstCall.args[0].value).to.equal('a,b')
    })
  })
})
