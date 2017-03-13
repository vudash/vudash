class WidgetPosition {
  constructor (dashboardLayout, position) {
    this.columns = dashboardLayout.columns
    this.rows = dashboardLayout.rows
    this.position = position
  }

  get rowHeight () {
    return 100 / this.rows
  }

  get columnWidth () {
    return 100 / this.columns
  }

  get height () {
    return this.position.h * this.rowHeight
  }

  get width () {
    return this.position.w * this.columnWidth
  }

  get left () {
    return this.position.x * this.columnWidth
  }

  get top () {
    return this.position.y * this.rowHeight
  }
}

module.exports = WidgetPosition
