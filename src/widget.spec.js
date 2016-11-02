'use strict'

const Widget = require('../widget')

describe('widget', () => {
  it('No config for travis', (done) => {
    const config = { schedule: 25000, provider: 'travis', user: 'x', repo: 'y' }
    const widget = new Widget()
    const configuration = widget.register(config)
    expect(configuration.schedule).to.equal(config.schedule)
    done()
  })

  it('Auth for circleci', (done) => {
    const config = { schedule: 25000, provider: 'circleci', user: 'x', repo: 'y', options: { auth: 'aaa' } }
    const widget = new Widget()
    const configuration = widget.register(config)
    expect(configuration.schedule).to.equal(config.schedule)
    done()
  })
})
