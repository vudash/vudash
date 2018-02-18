'use strict'

const Joi = require('joi')

const layoutSchema = Joi.object({
  columns: Joi.number().required().description('Number of columns'),
  rows: Joi.number().required().description('Number of rows')
}).required().description('Layout')

const widgetPositionSchema = Joi.object({
  x: Joi.number().required().description('Column for widget in dashboard, zero indexed'),
  y: Joi.number().required().description('Row for widget in dashboard, zero indexed'),
  w: Joi.number().required().description('Widget width in dashboard columns'),
  h: Joi.number().required().description('Widget height in dashboard rows')
}).required().description('Widget position data')

const widgetSchema = Joi.object({
  position: widgetPositionSchema,
  widget: Joi.any().required().description('Path to widget, Node package name, or Class'),
  options: Joi.object().optional().description('Widget configuration'),
  background: Joi.string().optional().description('Optional background styling, used as css background')
}).description('Widget Configuration')

const widgetsSchema = Joi.array().required().items(widgetSchema).description('List of widgets')

const datasourcesSchema = Joi.object().optional().description('Hash of datasources')

const dashboardSchema = Joi.object({
  name: Joi.string().optional().description('Dashboard name'),
  layout: layoutSchema,
  datasources: datasourcesSchema,
  widgets: widgetsSchema
}).description('Dashboard Descriptor')

class DescriptorParser {
  parse (json) {
    const result = Joi.validate(json, dashboardSchema, { allowUnknown: true })
    if (result.error) {
      throw new Error(result.error)
    }
    return result.value
  }
}

module.exports = new DescriptorParser()
