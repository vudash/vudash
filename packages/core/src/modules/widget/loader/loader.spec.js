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
      const fn = () => { loader.load('test/resources/widgets/missing') }
      expect(fn).to.throw(ComponentCompilationError, message)
    })
  })

  context('Valid Component', () => {
    let component

    beforeEach(() => {
      component = loader.load('test/resources/widgets/example')
    })

    it('returns registration method', () => {
      expect(component.widget.register).to.be.a.function()
    })

    it('returns markup path', () => {
      expect(component.componentPath).to.endWith('test/resources/widgets/example/markup.html')
    })

    it('returns registration method', () => {
      expect(component.name).to.exist().and.to.equal('VudashWidgetExample')
    })
  })
})
