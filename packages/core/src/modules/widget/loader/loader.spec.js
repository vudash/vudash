'use strict'

const loader = require('.')
const { ComponentCompilationError } = require('errors')
const { expect } = require('code')

describe('widget/loader', () => {
  context('Programmatic Config', () => {
    const pkg = {
      Module: { register: () => {} },
      component: 'some-component',
      name: 'vudash-some-component'
    }

    it('Parses Component', () => {
      const resolved = loader.load(pkg)
      expect(resolved).to.equal(pkg)
    })
  })

  context('Vudash Metadata', () => {
    it('fails to read component metadata', () => {
      const message = "Widget vudash-widget-missing is missing 'vudash.component' in package.json"
      const fn = () => { loader.load(resource('widgets/missing')) }
      expect(fn).to.throw(ComponentCompilationError, message)
    })
  })

  context('Valid Component', () => {
    it('reads component metadata', () => {
      const { component } = loader.load(resource('widgets/example'))
      expect(component).not.to.equal(undefined)
    })
  })
})
