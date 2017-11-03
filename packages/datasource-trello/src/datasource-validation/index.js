'use strict'

const Joi = require('joi')

exports.validation = {
  key: Joi.string().required().description('Trello API key'),
  token: Joi.string().required().description('Trello API token'),
  queryType: Joi.string().required().only('standup'),
  options: Joi.object({
    listId: Joi.string().required().description('id of list to fetch')
  }).required().description('query options')
}
