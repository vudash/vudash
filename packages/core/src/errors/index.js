'use strict'

class ComponentCompilationError extends Error {

}

class PluginRegistrationError extends Error {

}

class WidgetRegistrationError extends Error {

}

module.exports = {
  ComponentCompilationError,
  PluginRegistrationError,
  WidgetRegistrationError
}
