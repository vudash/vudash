'use strict'

const Joi = require('joi')
const { validation } = require('.')
const { expect } = require('code')

describe.only('datasource-trello/datasource-validation', () => {
  const scenarios = [
    {
      valid: false,
      error: /"options" is required/,
      config: {
        key: 'xxx',
        token: 'yyy',
        queryType: 'standup'
      }
    },
    {
      valid: false,
      error: /"key" is required/,
      config: {
        token: 'yyy',
        queryType: 'standup',
        options: {
          listId: 'abc'
        }
      }
    },
    {
      valid: false,
      error: /"token" is required/,
      config: {
        key: 'yyy',
        queryType: 'standup',
        options: {
          listId: 'abc'
        }
      }
    },
    {
      valid: false,
      error: /"queryType" must be one of/,
      config: {
        key: 'xxx',
        token: 'yyy',
        queryType: 'xxx',
        options: {
          listId: 'abc'
        }
      }
    },
    {
      valid: false,
      error: /"queryType" is required/,
      config: {
        key: 'xxx',
        token: 'yyy',
        options: {
          listId: 'abc'
        }
      }
    },
    {
      valid: false,
      error: /"listId" is required/,
      config: {
        key: 'xxx',
        token: 'yyy',
        queryType: 'standup',
        options: {}
      }
    }
  ]

  scenarios.forEach(({ valid, error, config }) => {
    context(`Configuration with ${error}`, () => {
      let validationResult

      beforeEach(() => {
        validationResult = Joi.validate(config, validation)
      })

      it('is not valid', () => {
        expect(!!validationResult.error).not.to.equal(valid)
      })

      it('has correct error', () => {
        expect(validationResult.error).to.match(error)
      })
    })
  })

  context('Valid config', () => {
    let validationResult

    const config = {
      key: 'xxx',
      token: 'yyy',
      queryType: 'standup',
      options: {
        listId: 'abc'
      }
    }

    beforeEach(() => {
      validationResult = Joi.validate(config, validation)
    })

    it('is valid', () => {
      expect(validationResult.error).to.be.null()
    })

    it('returns config', () => {
      expect(validationResult.value).to.equal(config)
    })
  })
})
