const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()

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

  it('Extracts from graph using hoek', () => {
    
  })

  it('Only handles single value transports', (done) => {

  })
})
