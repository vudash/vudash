'use strict'

class ComponentCompilationError extends Error {

}

class PluginRegistrationError extends Error {

}

class ConfigurationError extends Error {

}

class WidgetRegistrationError extends Error {

}

module.exports = {
  ComponentCompilationError,
  ConfigurationError,
  PluginRegistrationError,
  WidgetRegistrationError
}
