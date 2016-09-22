# vudash-widget-statistic

Displays a statistic, such as a visitor count, on a [Vudash](https://npmjs.org/vudash) Dashboard

Usage
=====
Simply include in your dashboard, and configure as required:

```javascript
  {
    "widget": "vudash-widget-statistic",
    "options": {
      "schedule": 60000 // Default 60000ms, how often to refresh
      "description": "Visitor Count" // Description shown below statistic
      "data-source": ([see transports documentation](vudash/vudash-transports/providers))
    }
  }
```

Where `transports` is the data source for your widget, and description is the title which sits under the widget.
