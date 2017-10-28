'use strict'

const Joi = require('joi')

class ConfigValidator {
  get inlineCredentialsValidation () {
    return Joi.object().required().keys({
      type: Joi.string().required().only('service_account').description('Key type'),
      project_id: Joi.string().required().description('Project name'),
      private_key_id: Joi.string().required().description('Project name'),
      private_key: Joi.string().required().description('Project name'),
      client_email: Joi.string().email().required().description('Project name'),
      client_id: Joi.string().required().description('Project name'),
      auth_uri: Joi.string().uri().required().description('Auth Uri'),
      token_uri: Joi.string().uri().required().description('Token Uri'),
      auth_provider_x509_cert_url: Joi.string().uri().required().description('Auth provider x509 certificate url'),
      client_x509_cert_url: Joi.string().uri().required().description('Client x509 certificate url')
    })
  }

  get fileCredentialsValidation () {
    return Joi.string().regex(/^file:.*/).required().description('Filesystem path to credentials json, prefixed with "file:"')
  }

  get validation () {
    return {
      sheet: Joi.string().required().description('Sheet id'),
      tab: Joi.string().required().description('Tab Name'),
      columns: this.columnSchema,
      rows: this.rowSchema,
      credentials: Joi.alternatives([
        this.inlineCredentialsValidation,
        this.fileCredentialsValidation
      ]).required().description('Service account credentials')
    }
  }

  get columnSchema () {
    return Joi.alternatives([
      Joi.string().required().description('Column heading'),
      Joi.array().required().description('Array of column headings')
    ]).required().description('Column or an array of Columns to retrieve')
  }

  get rowSchema () {
    return Joi.alternatives([
      Joi.number().required().description('Row number'),
      Joi.object().keys({
        from: Joi.number().required().description('First row in range'),
        to: Joi.number().required().description('Last row in range')
      }).required().description('Range selector')
    ]).required().description('Row number to retrieve, or object with "from" and "to" row numbers to select a range')
  }
}

module.exports = new ConfigValidator()
