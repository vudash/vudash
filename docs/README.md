# Vudash

[![Join the chat at https://gitter.im/vudash/vudash-core](https://badges.gitter.im/vudash/vudash-core.svg)](https://gitter.im/vudash/vudash-core?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/vudash/vudash.svg?branch=master)](https://travis-ci.org/vudash/vudash) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A dashboard, like dashing, but written in NodeJS.

Vudash open source component
Writen using hapijs, lab, material ui, socket.io, lerna, and svelte

# Quick start
In so few lines:
```bash
  npm install -g vudash
  vudash create
  vudash
```

# Usage
Install as a global module `npm install -g vudash` and use `vudash create` to create an example dashboard.
Add new widgets under `/widgets` and add them to your dashboard under `/dashboards`.

You can visit your created dashboard by visiting http://localhost:3000/`dashboard`.dashboard - where `dashboard` is the name of a JSON file within the `/dashboards` directory.

Visiting the root of the application will yield a list of all available dashboards, unless the environment variable `DEFAULT_DASHBOARD` is set, in which case that dashboard will be loaded instead. Other dashboards will still be available via the normal methods.

# Screenshots

![dashboard](https://cloud.githubusercontent.com/assets/218949/18632967/05d72ba6-7e72-11e6-964d-6de1f38135ac.png)
![graph](https://cloud.githubusercontent.com/assets/218949/18608448/68c9bf90-7ce1-11e6-95a9-15c864722271.png)

# Demo

[Demo Dashboard](http://vudash.herokuapp.com/demo.dashboard)

If, like me, you learn by example rather than reams of documentation, check out the [Demo Dashboard's Configuration](https://github.com/vudash/vudash-demo/blob/master/dashboards/demo.json) on github. You can then clarify any questions using the documentation below.

# Dashboards
A dashboard is a collection of widgets separated into rows and columns.

## Creating Dashboards

Dashboards are in JSON format and take the form:
```javascript
{
  "name": "Happy",
  "layout": {
    "columns": 5,
    "rows": 4
  },
  "plugins": {
    "datasource-exchange-rates": { 
      "module": "@vudash/datasource-rest",
      "options": {
        "url": "http://exchangerat.es/api/v1/rates",
        "method": "get"
      }
    }
  },
  "widgets": [
    { "position": {"x": 0, "y": 0, "w": 1, "h": 1}, "widget": "./widgets/random" },
    { "position": {"x": 3, "y": 0, "w": 2, "h": 1}, "widget": "vudash-widget-time" },
    { "position": {"x": 4, "y": 1, "w": 1, "h": 1}, "widget": "./widgets/github" },
    { "position": {"x": 0, "y": 1, "w": 2, "h": 1},
      "widget": "vudash-widget-statistic",
      "datasource": {
        "name": "datasource-exchange-rates",
        "options": {
          "graph": "rates.GBP"  
        }
      },
      "options": {
        "description": "EUR -> GBP",
        "schedule": 60000 
      }
    },
    { "position": {"x": 4, "y": 2, "w": 1, "h": 1},
      "widget": "vudash-widget-travis",
      "options": {
        "user": "vudash",
        "repo": "vudash-widget-travis"
      }
    }
  ]
}

```
Where 'widgets' is an array of widgets. The position in the grid (specified by `layout`) is indicated by the widget's `x` and `y` `position` values.

The values for `position.w` and `position.h` are the number of grid units the widget occupies in width and height, respectively.

Widgets can be either a path to a directory containing a widget (see below), or an npm module of the same. If the widget is a npm module, you would need to `npm install --save <widget-name>` first.

# Widgets

Widgets are configured in the dashboard.json file, in the format:

```javascript
{
  "widget": "./widgets/pluck", // widget file path, node module name, or class definition
  "position": {
    "x": 1, // x position (row number) of widget
    "y": 1, // y position (column number) of widget
    "w": 1, // widget width in columns
    "h": 1  // widget height in columns
  },
  "options": { // widget specific config
    "your" : "config"
  },
  "datasource": {
    // datasource configuration for fetching data
  }
}
```

Widgets have some optional properties:

| property name | description                          | example |
| ------------- | ------------------------------------ | ------- |
| background    | css for "background" style attribute | #ffffff |

# Troubleshooting

* Q. The console shows that the websocket is failing to connect, and my widgets aren't updating.
* A. Your hosting provider might not be correctly reporting the external vhost of the server. Add an environment variable `SERVER_URL` with the full url to your server, i.e: `http://www.example.com/`

# Contributing

## Running Tests

Vudash > 5 is a monorepo! This makes it easier to contribute, and keep track of all the native plugins.

Clone the project and run:

```
lerna bootstrap
lerna run test
```

# Why create Vudash?

* I'll get to the point. I like dashing, but I don't like ruby.
* Both Dashing and Dashing-js are stellar efforts, but abandoned.
* Jade is an abomination.
* Coffeescript is an uneccessary abstraction.
* dashing-js has a lot of bugs

# Features

* will happily run on a free heroku instance
* es6
* all cross-origin requests done server side
* websockets rather than polling
* websocket fallback to long-poll when sockets aren't available
* Custom widgets
* Custom dashboards
* Simple row-by-row layout
* Dashboard arrangement is simply the config order (see below)
* Super simple widget structure

# Roadmap

 - Heroku easy deploy
 - You, sending Pull Requests.
 - Plugins

# Credits

 - Concept and foundation by Antony Jones / Desirable Objects Ltd
 - Contributions from github committers
 - Contains svg imagery from flaticons, by [Gregor Cresnar](http://www.flaticon.com/authors/gregor-cresnar), [Vectors Market](http://www.flaticon.com/authors/vectors-market)