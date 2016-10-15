# vudash-widget-statistic

Displays a statistic, such as a visitor count, on a [Vudash](https://npmjs.org/vudash) Dashboard

Usage
=====
Simply include in your dashboard, and configure as required:

```javascript
  {
    "widget": "vudash-widget-statistic",
    "options": {
      "schedule": 60000, // Optional. Default 60000ms, how often to refresh
      "description": "Visitor Count", // Optional. Default "Statistics" Description shown below statistic,
      "format": "%s", // Optional. Default %s. Format the incoming data (using sprintf-js)
      "data-source": { ... } // Required. See transports documentation
    }
  }
```

Note that `data-source` tells the widget where to get data, and is using the [vudash-transports plugin](https://github.com/vudash/vudash-transports/providers) to get data for your widget.
