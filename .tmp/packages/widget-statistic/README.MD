# vudash-widget-statistic

Displays a statistic, such as a visitor count, on a [Vudash](https://npmjs.org/vudash) Dashboard

![stats widget](https://cloud.githubusercontent.com/assets/218949/20489789/adb964ca-b003-11e6-917b-c07218625bd3.png)

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

Graphs
======
This widget will graph data which is passed in as an array.

This means that if your data-source resolves an array of numbers as data, the first number in the array 
will be shown as the statistic value, and a line graph will be drawn behind the widget using the remaining numbers.

For example

`[1,2,3,4,5,6,7]` will result in a widget value of 7, and a graph of 1-6 behind it.