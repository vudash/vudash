'use strict'

const WidgetPosition = require('.')

describe('css-builder/widget-position', () => {
  const dashboard = { columns: 5, rows: 4 }

  it('Calculates first widget dimensions', () => {
    const position = { x: 0, y: 0, w: 1, h: 1 }
    const widgetPosition = new WidgetPosition(dashboard, position)
    expect(widgetPosition.top).to.equal(0)
    expect(widgetPosition.left).to.equal(0)
    expect(widgetPosition.width).to.equal(20)
    expect(widgetPosition.height).to.equal(25)
  })

  it('Calculates middle widget dimensions', () => {
    const position = { x: 2, y: 4, w: 2, h: 1 }
    const widgetPosition = new WidgetPosition(dashboard, position)
    expect(widgetPosition.top).to.equal(100)
    expect(widgetPosition.left).to.equal(40)
    expect(widgetPosition.width).to.equal(40)
    expect(widgetPosition.height).to.equal(25)
  })
})