'use strict'

const { schema } = require('.')
const fs = require('fs')
const { join } = require('path')
const { expect } = require('code')
const Joi = require('joi')

describe('dashboard/schema', () => {
  context('Parse', () => {
    it('Throws on invalid schema', () => {
      const { error } = Joi.validate({}, schema)
      expect(error.message).to.include('"layout" is required')
    })

    const dashboardsDir = join(__dirname, '..', '..', '..', 'dashboards')
    const boards = fs.readdirSync(dashboardsDir)

    boards.forEach(board => {
      it(`Parses valid schema ${board}`, () => {
        const json = require(join(dashboardsDir, board))
        const { error } = Joi.validate(json, schema)
        expect(error).not.to.exist()
      })
    })
  })

  context('validation', () => {
    context('datasources', () => {
      it('are optional', () => {
        const descriptor = {
          layout: {
            columns: 1,
            rows: 1
          },
          widgets: []
        }
        const { value } = Joi.validate(descriptor, schema)
        expect(value).to.equal(descriptor)
      })

      it('must be datasources', () => {
        const descriptor = {
          layout: {
            columns: 1,
            rows: 1
          },
          widgets: [],
          datasources: {
            'some-datasource': {}
          }
        }

        const { error } = Joi.validate(descriptor, schema)
        expect(error.message).to.include('fails because [child "module" fails')
      })
    })

    it('datasource options is optional', () => {
      const descriptor = {
        layout: {
          columns: 1,
          rows: 1
        },
        widgets: [],
        datasources: {
          'some-datasource': {
            module: 'a',
            schedule: 30000
          }
        }
      }
      const { value } = Joi.validate(descriptor, schema)
      expect(value).to.equal(descriptor)
    })

    it('must include update schedule', () => {
      const descriptor = {
        layout: {
          columns: 1,
          rows: 1
        },
        widgets: [],
        datasources: {
          'some-datasource': {
            module: 'a'
          }
        }
      }

      const { error } = Joi.validate(descriptor, schema)
      expect(error.message).to.include('"schedule" is required')
    })

    it('update schedule must be in milliseconds', () => {
      const descriptor = {
        layout: {
          columns: 1,
          rows: 1
        },
        widgets: [],
        datasources: {
          'some-datasource': {
            module: 'a',
            schedule: 'aaa'
          }
        }
      }
      const { error } = Joi.validate(descriptor, schema)
      expect(error.message).to.include('"schedule" must be a number')
    })

    it('must include module name', () => {
      const descriptor = {
        layout: {
          columns: 1,
          rows: 1
        },
        widgets: [],
        datasources: {
          'some-datasource': {
            schedule: 30000
          }
        }
      }
      const { error } = Joi.validate(descriptor, schema)
      expect(error.message).to.include('"module" is required')
    })
  })
})
