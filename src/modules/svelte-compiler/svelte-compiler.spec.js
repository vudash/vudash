'use strict'

const compiler = require('.')
const fs = require('fs')

describe('svelte-compiler', () => {
  context('Multi-file component', () => {
    const script = "export default { data () { return { msg: 'Hello' } } }"
    const styles = 'h1 { font-weight: bold; }'
    const markup = '<h1>{{msg}}</h1>'
    const packageJson = {
      name: 'vudash-wiget-something',
      vudash: {
        markup: 'src/client/markup.html',
        script: 'src/client/client.js',
        styles: 'src/client/client.css'
      }
    }
    let readFileStub

    before((done) => {
      readFileStub = sinon.stub(fs, 'readFileSync')
      readFileStub.withArgs('/widget/package.json').returns(JSON.stringify(packageJson))
      readFileStub.withArgs(`/widget/${packageJson.vudash.markup}`).returns(markup)
      readFileStub.withArgs(`/widget/${packageJson.vudash.styles}`).returns(styles)
      readFileStub.withArgs(`/widget/${packageJson.vudash.script}`).returns(script)

      done()
    })

    after((done) => {
      readFileStub.restore()
      done()
    })

    it('compiles svelte component', (done) => {
      const { code } = compiler.compile('/widget')
      expect(code).not.to.equal(undefined)
      done()
    })
  })

  context('Single file component', () => {
    const component = `
      <h1>{{msg}}</h1>  
      <style>
        h1 { font-weight: bold; }
      </style>
      <script>
        export default { data () { return { msg: 'Hello' } } }
      </script>
    `
    const packageJson = {
      name: 'vudash-wiget-something',
      vudash: {
        component: 'src/client/component.html'
      }
    }

    let readFileStub
    before((done) => {
      readFileStub = sinon.stub(fs, 'readFileSync')
      readFileStub.withArgs('/widget/package.json').returns(JSON.stringify(packageJson))
      readFileStub.withArgs(`/widget/${packageJson.vudash.component}`).returns(component)

      done()
    })

    after((done) => {
      readFileStub.restore()
      done()
    })

    it('compiles svelte component', (done) => {
      const { code } = compiler.compile('/widget')
      expect(code).not.to.equal(undefined)
      done()
    })
  })
})