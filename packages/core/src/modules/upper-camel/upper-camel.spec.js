'use strict'

const { upperCamel } = require('.')

describe('upper-camel', (done) => {
  const scenarios = [
    { input: 'some-name', output: 'SomeName' },
    { input: 'SomeName', output: 'SomeName' },
    { input: '@scope/package-name', output: 'ScopePackageName' },
    { input: '__some/name%&', output: 'SomeName' }
  ]

  scenarios.forEach(({ input, output }) => {
    it(`${input} becomes ${output}`, done => {
      expect(upperCamel(input))
        .to.exist()
        .and.to.be.a.string()
        .and.to.equal(output)
      done()
    })
  })
})
