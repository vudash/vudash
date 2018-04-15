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
  datasource: Joi.string().optional().description('Datasource name'),
  options: Joi.object().optional().description('Widget configuration'),
  background: Joi.string().optional().description('Optional background styling, used as css background')
}).description('Widget Configuration')

const widgetsSchema = Joi.array().required().items(widgetSchema).description('List of widgets')

const datasourcesSchema = Joi.object().pattern(/.*/, Joi.object({
  module: Joi.string().required().description('Datasource module name or directory path'),
  schedule: Joi.number().required().description('Update frequency, milliseconds'),
  options: Joi.object().optional().description('Datasource specific options')
})).optional().description('Hash of datasources')

const dashboardSchema = Joi.object({
  name: Joi.string().optional().description('Dashboard name'),
  layout: layoutSchema,
  datasources: datasourcesSchema,
  widgets: widgetsSchema
}).description('Dashboard Descriptor')

exports.schema = dashboardSchema
