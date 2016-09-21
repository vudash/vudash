const Chance = require('chance')
const chance = new Chance()
const Promise = require('bluebird').Promise

const Transport = require('..')
const Joi = require('joi')

class ChanceTransport extends Transport {

  get configValidation () {
    return Joi.object({})
  }

  fetch () {
    return Promise.resolve(chance.natural({min: 0, max: 999}))
  }
}

module.exports = ChanceTransport
