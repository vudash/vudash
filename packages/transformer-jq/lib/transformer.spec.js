'use strict'

const JqTransformer = require('./transformer')
const { expect } = require('code')

describe('transformer', () => {
  const usersIn = {
    jeff: {
      email: 'jeff@example.net'
    },
    joe: {
      phone: '+447721981546'
    },
    emma: {
      email: 'emma@example.com'
    },
    grayson: {
      email: 'wailo@example.net'
    }
  }

  const groupsOut = {
    'example.net': [
      {
        email: 'jeff@example.net'
      },
      {
        email: 'wailo@example.net'
      }
    ],
    'example.com': [
      {
        email: 'emma@example.com'
      }
    ]
  }

  it('transforms value', async () => {
    const value = 'filter(has("email")) | groupBy(flow(get("email"), split("@"), get(1)))'
    const transformer = new JqTransformer({ value })
    const out = await transformer.transform(usersIn)
    expect(out).to.equal(groupsOut)
  })
})