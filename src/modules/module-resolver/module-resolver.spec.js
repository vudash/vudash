'use strict'

const moduleResolver = require('.')
const { ComponentCompilationError } = require('../../errors')

describe('module-resolver', () => {
  context('Programmatic Config', () => {
    const pkg = {
      Module: { register: () => {} },
      html: 'some-component',
      name: 'vudash-some-component'
    }

    it('Parses component', (done) => {
      const resolved = moduleResolver.resolve(pkg)
      expect(resolved).to.equal(pkg)
      done()
    })
  })

  context('Multi-file component', () => {
    it('reads component metadata', (done) => {
      const { html } = moduleResolver.resolve(resource('widgets/example'))
      expect(html).not.to.equal(undefined)
      done()
    })

    it('Loads component module', (done) => {
      const { Module } = moduleResolver.resolve(resource('widgets/example'))
      expect(Module).not.to.equal(undefined)
      done()
    })

    it('reads component metadata', (done) => {
      const { name } = moduleResolver.resolve(resource('widgets/example'))
      expect(name).to.equal('VudashWidgetExample')
      done()
    })
  })

  context('Component has no required properties', () => {
    it('reads component metadata', (done) => {
      const message = `Unable to compile component vudash-widget-missing as it is missing 'vudash' configuration in package.json`
      const fn = () => { moduleResolver.resolve(resource('widgets/missing')) }
      expect(fn).to.throw(ComponentCompilationError, message)
      done()
    })
  })

  context('Single file component', () => {
    it('reads component metadata', (done) => {
      const { html } = moduleResolver.resolve(resource('widgets/single'))
      expect(html).not.to.equal(undefined)
      done()
    })
  })
})
