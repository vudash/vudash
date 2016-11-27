const Transport = require('..')
const Joi = require('joi')
const path = require('path')
const fs = require('fs')
const Promise = require('bluebird').Promise
const spreadsheetToJson = require('spreadsheet-to-json')

class GoogleSheetsTransport extends Transport {

  constructor (descriptor) {
    super(descriptor)

    this.extract = Promise.promisify(spreadsheetToJson.extractSheets)

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
      columns: this.columnSchema,
      rows: this.rowSchema,
      credentials: Joi.alternatives([
        this.inlineCredentialsValidation,
        this.fileCredentialsValidation
      ]).required().description('Service account credentials')
    }).required().description('Configuration')
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

  fetch () {
    const conf = this.config

    return this.extract({
      spreadsheetKey: conf.sheet,
      credentials: conf.credentials,
      sheetsToExtract: [conf.tab]
    }).then(this._extractCellData.bind(this))
  }

  _extractCellData (data) {
    const conf = this.config
    const tab = data[conf.tab]
    const multiCell = (typeof conf.rows === 'object' || Array.isArray(conf.columns))

    return multiCell ? this._toMatrix(tab) : this._extractCellValue(tab)
  }

  _toMatrix (tab) {
    const conf = this.config

    return tab.map((row) => {
      const columns = Object.keys(row).filter((col) => { 
        return conf.columns.includes(col) 
      })

      return columns.map((column) => {
        return row[column]
      })
    })
  }

  _extractCellValue (tab) {
    const conf = this.config
    return tab[conf.rows - 1][conf.columns]
  }
}

module.exports = GoogleSheetsTransport
