'use strict'

const ChartTypes = {
  'line': {
    constructorName: 'Line',
    options: {
      chartPadding: {
        right: 60
      }
    }
  },
  'pie': {
    constructorName: 'Pie'
  },
  'bar': {
    constructorName: 'Bar'
  },
  'donut': {
    constructorName: 'Pie',
    options: {
      donut: true,
      donutWidth: 60,
      donutSolid: true
    }
  }
}

exports.get = function (chartType) {
  return ChartTypes[chartType] || ChartTypes.line
}
