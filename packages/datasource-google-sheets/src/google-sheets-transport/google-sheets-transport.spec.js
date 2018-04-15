'use strict'

const GoogleSheetsTransport = require('.')
const configUtil = require('../../test/config.util')
const sinon = require('sinon')
const { expect } = require('code')

describe('google-sheets-transport', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
  })

  context('External credentials', () => {
    it('Loads credentials from disk', () => {
      const contents = require('../../test/example.credentials.test.json')
      const credentials = 'file:../../test/example.credentials.test.json'
      const config = configUtil.getSingleCellConfig(credentials)
      const transport = new GoogleSheetsTransport(config)
      expect(transport.credentials).to.equal(contents)
    })

    it('File not found', () => {
      expect(() => {
        return new GoogleSheetsTransport(configUtil.getSingleCellConfig('file:some-nonexistent-file'))
      }).to.throw(Error, /some-nonexistent-file" as it could not be found/)
    })

    it('Validates credentials loaded from disk', () => {
      expect(() => {
        return new GoogleSheetsTransport(configUtil.getSingleCellConfig('file:../../test/example.invalid-credentials.test.json'))
      }).to.throw(Error, /fails because/)
    })

    it('Read credentials from file', () => {
      const credentials = 'file:../../test/example.credentials.test.json'
      const transport = new GoogleSheetsTransport(configUtil.getSingleCellConfig(credentials))
      expect(transport).to.be.an.instanceOf(GoogleSheetsTransport)
    })
  })

  it('Fetches single cell sheet data', () => {
    const config = configUtil.getSingleCellConfig()
    const transport = new GoogleSheetsTransport(config)

    sinon.stub(transport, 'extract')
      .withArgs({
        spreadsheetKey: config.sheet,
        credentials: config.credentials,
        sheetsToExtract: [config.tab]
      }).returns(Promise.resolve({
        [config.tab]: [
          {
            [config.columns]: 'myValue'
          }
        ]
      }))

    return transport.fetch().then((result) => {
      expect(transport.extract.callCount).to.equal(1)
      expect(result).to.equal('myValue')
    })
  })

  it('Fetches range of sheet data', () => {
    const config = configUtil.getRangeConfig()
    const transport = new GoogleSheetsTransport(config)

    sinon.stub(transport, 'extract')
      .withArgs({
        spreadsheetKey: config.sheet,
        credentials: config.credentials,
        sheetsToExtract: [config.tab]
      }).returns(Promise.resolve({
        [config.tab]: [
          {
            [config.columns[0]]: 'cell0,0',
            [config.columns[1]]: 'cell0,1'
          },
          {
            [config.columns[0]]: 'cell1,0',
            [config.columns[1]]: 'cell1,1'
          },
          {
            [config.columns[0]]: 'cell2,0',
            [config.columns[1]]: 'cell2,1'
          }
        ]
      }))

    return transport.fetch().then((result) => {
      expect(transport.extract.callCount).to.equal(1)
      expect(result).to.equal([
        ['cell0,0', 'cell0,1'],
        ['cell1,0', 'cell1,1'],
        ['cell2,0', 'cell2,1']
      ])
    })
  })

  it('Fetches single column of sheet data', () => {
    const config = configUtil.getSingleColumnConfig()
    const transport = new GoogleSheetsTransport(config)

    sinon.stub(transport, 'extract')
      .withArgs({
        spreadsheetKey: config.sheet,
        credentials: config.credentials,
        sheetsToExtract: [config.tab]
      }).returns(Promise.resolve({
        [config.tab]: [
          {
            [config.columns[0]]: 'cell0,0',
            unused: 'cell0,1'
          },
          {
            [config.columns[0]]: 'cell1,0',
            unused: 'cell1,1'
          },
          {
            [config.columns[0]]: 'cell2,0',
            unused: 'cell2,1'
          }
        ]
      }))

    return transport.fetch().then((result) => {
      expect(transport.extract.callCount).to.equal(1)
      expect(result).to.equal([
        'cell0,0',
        'cell1,0',
        'cell2,0'
      ])
    })
  })
})
