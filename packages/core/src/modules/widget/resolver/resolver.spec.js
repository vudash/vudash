'use strict'

const moduleResolver = require('.')
const { ComponentCompilationError } = require('../../../errors')

describe('widget/resolver', () => {
  context('Programmatic Config', () => {
    const pkg = {
      Module: { register: () => {} },
      component: 'some-component',
      name: 'vudash-some-component'
    }

    it('Parses Component', (done) => {
      const resolved = moduleResolver.resolve(pkg)
      expect(resolved).to.equal(pkg)
      done()
    })
  })

  context('Vudash Metadata', () => {
    it('fails to read component metadata', (done) => {
      const message = "Component vudash-widget-missing is missing 'vudash.component' in package.json"
      const fn = () => { moduleResolver.resolve(resource('widgets/missing')) }
      expect(fn).to.throw(ComponentCompilationError, message)
      done()
    })
  })

  context('Valid Component', () => {
    it('reads component metadata', (done) => {
      const { component } = moduleResolver.resolve(resource('widgets/example'))
      expect(component).not.to.equal(undefined)
      done()
    })
  })
})
