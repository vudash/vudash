'use strict'

const resolver = require('./resolver')
const { PluginRegistrationError } = require('../../errors')

class PluginLoader {
  load (dashboard, plugins) {
    plugins.forEach(({ plugin: moduleName, options }) => {
      const Plugin = resolver.resolve(moduleName)
      const validationErrors = Plugin.validateOptions(options)
      if (validationErrors) {
        throw new PluginRegistrationError(
          `Could not register plugin ${moduleName} due to invalid configuration: ${validationErrors.join(', ')}`
        )
      }
      const plugin = new Plugin(options)
      plugin.register(dashboard)
    })
  }
}

module.exports = new PluginLoader()
