'use strict'

class AssetBuilder {
  _relativise (asset) {
    return asset.indexOf('://') > -1 ? asset : `/thirdparty/${asset}`
  }

  build (assets) {
    if (!assets) { return {} }
    return {
      js: assets.js.map(this._relativise),
      css: assets.css.map(this._relativise)
    }
  }
}

module.exports = new AssetBuilder()
