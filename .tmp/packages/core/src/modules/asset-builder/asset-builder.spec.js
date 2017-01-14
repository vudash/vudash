'use strict'

const DashboardBuilder = require(fromTest('util/dashboard.builder'))
const assetBuilder = require('.')

describe('modules/asset-builder', () => {
  context('Assets', () => {
    let assets

    before((done) => {
      const descriptor = DashboardBuilder.create()
      .addJsAsset('some-asset.js')
      .addJsAsset('https://example.net/some.js')
      .addCssAsset('some-asset.css')
      .addCssAsset('https://example.net/some.css')
      .build()

      assets = assetBuilder.build(descriptor.assets)
      done()
    })

    it('Js Asset is present', (done) => {
      expect(assets.js.length).to.equal(2)
      done()
    })

    it('Local Js Asset is served', (done) => {
      expect(assets.js[0]).to.equal('/thirdparty/some-asset.js')
      done()
    })

    it('Hosted Js Asset is served', (done) => {
      expect(assets.js[1]).to.equal('https://example.net/some.js')
      done()
    })

    it('Css Asset is present', (done) => {
      expect(assets.css.length).to.equal(2)
      done()
    })

    it('Local Css Asset is served', (done) => {
      expect(assets.css[0]).to.equal('/thirdparty/some-asset.css')
      done()
    })

    it('Hosted Css Asset is served', (done) => {
      expect(assets.css[1]).to.equal('https://example.net/some.css')
      done()
    })
  })
})
