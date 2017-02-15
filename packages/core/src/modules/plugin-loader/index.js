'use strict'

const resolver = require('./resolver')
const configValidator = require('../config-validator')

class PluginLoader {
  load (dashboard, plugins) {
    plugins.forEach(({ plugin: moduleName, options }) => {
      const Plugin = resolver.resolve(moduleName)

      const validation = Plugin.configValidation
      configValidator.validate(`plugin:${moduleName}`, validation, options)

      const plugin = new Plugin(options)
      plugin.register(dashboard)
    })
  }
}

module.exports = new PluginLoader()
