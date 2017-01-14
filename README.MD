# vudash-widget-gauge

Displays a gauge, like a vu-meter, on a [Vudash](https://npmjs.org/vudash) Dashboard

Usage
=====
Simply include in your dashboard, and configure as required (defaults are shown):

```javascript
  {
    "widget": "vudash-widget-statistic",
    "options": {
      "schedule": 60000, // Optional. How often to refresh
      "description": "Gauge", // Optional. Description shown below statistic,
      'initial-value': 27,
      'min': 0,
      'max': 100,
      'pointer.background-colour': 'orange' // Optional, Background colour of pointer,
      'pointer.colour': 'indicatorColour', // Optional, Foreground colour of pointer.
      'value.font-size': 'valueFontSize', // Optional. Font size of gauge value.
      'value.colour': 'valueColour', // Optional. Colour of gauge value.
      "data-source": { ... } // Required. See transports documentation
    }
  }
```

Note that `data-source` tells the widget where to get data, and is using the [vudash-transports plugin](https://github.com/vudash/vudash-transports/providers) to get data for your widget.
