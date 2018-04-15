'use strict'

const { expect } = require('code')
const { parse } = require('.')
const { ConfigurationError } = require('../../../errors')

describe('dashboard/parser', () => {
  beforeEach(() => {
    process.env.SOME_KEY = 'abcde'
  })

  afterEach(() => {
    process.env.SOME_KEY = undefined
  })

  it('replaces config element with environmental variable', () => {
    const config = {
      some: {
        value: { $env: 'SOME_KEY' }
      }
    }

    expect(parse(config)).to.equal({
      some: {
        value: 'abcde'
      }
    })
  })

  it('replaces multiple elements', () => {
    const config = {
      some: {
        value: { $env: 'SOME_KEY' },
        other: {
          value: { $env: 'SOME_KEY' }
        }
      }
    }

    expect(parse(config)).to.equal({
      some: {
        value: 'abcde',
        other: {
          value: 'abcde'
        }
      }
    })
  })

  it('replaces entire element', () => {
    const config = {
      some: {
        value: {
          $env: 'SOME_KEY',
          invalid: 'entry'
        }
      }
    }

    expect(parse(config)).to.equal({
      some: {
        value: 'abcde'
      }
    })
  })

  it('throws error if variable does not exist', () => {
    const config = {
      some: {
        value: { $env: 'NONEXISTENT_KEY' }
      }
    }

    expect(() => {
      parse(config)
    }).to.throw(
      ConfigurationError,
      'Environment variable NONEXISTENT_KEY does not exist'
    )
  })
})
