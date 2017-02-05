'use strict'

class PluginResolver {
  resolve (plugin) {
    console.log('Loading Plugin', plugin)
    return require(plugin)
  }
}

module.exports = new PluginResolver()
