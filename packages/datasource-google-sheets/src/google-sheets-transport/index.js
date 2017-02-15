const path = require('path')
const fs = require('fs')
const Promise = require('bluebird').Promise
const spreadsheetToJson = require('spreadsheet-to-json')
const configValidator = require('../config-validator')

class GoogleSheetsTransport {

  constructor (options) {
    this.config = options
    this.extract = Promise.promisify(spreadsheetToJson.extractSheets)

    this.credentials = options.credentials
    if (typeof this.credentials === 'string') {
      this.credentials = this.loadCredentialsFromDisk(this.credentials)
    }
  }

  get widgetValidation () {
    return configValidator.widgetValidation
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
    this.validate(configValidator.inlineCredentialsValidation, credentials)

    return credentials
  }

  validate (schema, credentials) {
    schema.validate(credentials, (err) => {
      if (err) { throw err }
    })
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

      const values = columns.map((column) => {
        return row[column]
      })

      return values.length > 1 ? values : values[0]
    })
  }

  _extractCellValue (tab) {
    const conf = this.config
    return tab[conf.rows - 1][conf.columns]
  }
}

module.exports = GoogleSheetsTransport
