const Transport = require('..')
const Joi = require('joi')
const path = require('path')
const fs = require('fs')

class GoogleSheetsTransport extends Transport {

  constructor (descriptor) {
    super(descriptor)

    this.credentials = this.config.credentials
    if (typeof this.credentials === 'string') {
      this.credentials = this.loadCredentialsFromDisk(this.credentials)
    }
  }

  loadCredentialsFromDisk () {
    if (this.credentials.indexOf('file:') !== 0) {
      throw new Error('File credentials must be prefixed with "file:" and reference a local json service account credentials file')
    }
    const fileName = this.credentials.split(':')[1]
    const resolvedFile = path.join(__dirname, fileName)

    if (!fs.existsSync(resolvedFile)) {
      throw new Error(`Credentials could not be loaded from "${resolvedFile}" as it could not be found`)
    }

    const credentials = require(resolvedFile)
    this.validate(this.inlineCredentialsValidation, credentials)

    return credentials
  }

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
    return Joi.string().required().description('Filesystem path to credentials json, prefixed with "file:"')
  }

  get configValidation () {
    return Joi.object().keys({
      sheet: Joi.string().required().description('Sheet id'),
      tab: Joi.string().required().description('Tab Name'),
      column: Joi.string().required().description('Column Heading Name'),
      formatter: Joi.string().optional().description('Format specifier for cell value'),
      credentials: Joi.alternatives([
        this.inlineCredentialsValidation,
        this.fileCredentialsValidation
      ]).required().description('Service account credentials')
    }).required().description('Configuration')
  }

}

module.exports = GoogleSheetsTransport
