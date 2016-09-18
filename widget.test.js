const expect = require('code').expect
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it

const Widget = require('./widget')
const widget = new Widget()

describe('widget', () => {
  it('Plucks basic value which exists', (done) => {
    const json = {
      a: {
        b: {
          c: 'd'
        }
      }
    }
    const value = widget._extractValue(json, 'a.b.c')
    expect(value).to.equal('d')
    done()
  })
  it('Plucks nonexistent value', (done) => {
    const json = {
      a: {
        b: {
          c: 'd'
        }
      }
    }
    const value = widget._extractValue(json, 'x.y.z')
    expect(value).to.equal(undefined)
    done()
  })
})
