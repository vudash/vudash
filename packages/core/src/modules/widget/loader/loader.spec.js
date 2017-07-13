'use strict'

const loader = require('.')
const { ComponentCompilationError } = require('../../../errors')

describe('widget/loader', () => {
  context('Programmatic Config', () => {
    const pkg = {
      Module: { register: () => {} },
      component: 'some-component',
      name: 'vudash-some-component'
    }

    it('Parses Component', (done) => {
      const resolved = loader.load(pkg)
      expect(resolved).to.equal(pkg)
      done()
    })
  })

  context('Vudash Metadata', () => {
    it('fails to read component metadata', (done) => {
      const message = "Widget vudash-widget-missing is missing 'vudash.component' in package.json"
      const fn = () => { loader.load(resource('widgets/missing')) }
      expect(fn).to.throw(ComponentCompilationError, message)
      done()
    })
  })

  context('Valid Component', () => {
    it('reads component metadata', (done) => {
      const { component } = loader.load(resource('widgets/example'))
      expect(component).not.to.equal(undefined)
      done()
    })
  })
})
