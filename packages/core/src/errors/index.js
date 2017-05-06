'use strict'

class PluginRegistrationError extends Error {

}

class ConfigurationError extends Error {

}

class WidgetRegistrationError extends Error {

}

module.exports = {
  ConfigurationError,
  PluginRegistrationError,
  WidgetRegistrationError
}
