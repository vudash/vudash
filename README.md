[![Join the chat at https://gitter.im/vudash/vudash-core](https://badges.gitter.im/vudash/vudash-core.svg)](https://gitter.im/vudash/vudash-core?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/vudash/vudash-core.svg?branch=master)](https://travis-ci.org/vudash/vudash-core) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# Vudash
A dashboard, like dashing, but written in NodeJS.

## vudash-core
Vudash open source component
Writen using hapijs, lab, semantic ui, socket.io

## What does it look like?

![dashboard](https://cloud.githubusercontent.com/assets/218949/18632967/05d72ba6-7e72-11e6-964d-6de1f38135ac.png)
![graph](https://cloud.githubusercontent.com/assets/218949/18608448/68c9bf90-7ce1-11e6-95a9-15c864722271.png)

## Demo

http://vudash.herokuapp.com/demo.dashboard

## Why?
* I'll get to the point. I like dashing, but I don't like ruby.
* Both Dashing and Dashing-js are stellar efforts, but abandoned.
* Jade is an abomination.
* Coffeescript is an uneccessary abstraction.
* dashing-js has more bugs than code

## Features
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

## Tests
Clone me and run `npm test`

## Project Status
Status: Rewrote entire original 'vudash' application as a core-component of a bigger project.
Now fully tested, with a handful of example widgets.

## Usage
Install as a global module `npm install -g vudash` and use `vudash create` to create an example dashboard.
Add new widgets under `/widgets` and add them to your dashboard under `/dashboards`.

You can visit your created dashboard by visiting http://localhost:3000/<dashboard>.dashboard - where `<dashboard>` is the name of a JSON file within the `/dashboards` directory.

## Quick start
In so few lines:
```bash
  npm install -g vudash
  vudash create
  vudash
```

## Dashboards
A dashboard is a collection of widgets separated into rows and columns.

Dashboards are in JSON format and take the form:
```javascript
{
  "name": "Happy",
  "layout": {
    "columns": 5,
    "rows": 4
  },
  "shared-config": {
    "google-config": {
      "email": "you@example.net"
    }
  }
  "widgets": [
    { "position": {"x": 0, "y": 0, "w": 1, "h": 1}, "widget": "./widgets/random" },
    { "position": {"x": 3, "y": 0, "w": 2, "h": 1}, "widget": "vudash-widget-time" },
    { "position": {"x": 4, "y": 1, "w": 1, "h": 1}, "widget": "./widgets/github" },
    { "position": {"x": 0, "y": 1, "w": 2, "h": 1},
      "widget": "vudash-widget-pluck",
      "options": {
        "_extends": "google-config",
        "path": "rates.GBP", "description": "EUR -> GBP"
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

Widgets can share configuration by using `shared-config` which is a key-values map of config names to config objects. You can then use `_extends` in the `options` block of a widget config, and only override the widget properties that you wish to change.

## Widgets

Widgets are configured in the dashboard.json file, in the format:

```javascript
{
  "widget": "./widgets/pluck",
  "options": {
    "your" : "config"
  }
}
```

### Creating a widget

A widget is a visible indicator of some sort of statistic or other monitor, which emits new data using websockets, and updates its display in the dashboard based on the information given in this data.

A widget is packaged as a node module, but a node module can simply be a folder with a `package.json` file. It can then contain a number of files:

### Predefined widgets
There are a series of pre-defined widgets available. These widgets are [npm packages beginning with 'vudash-widget'](https://www.npmjs.com/search?q=vudash-widget) Generally the widget's major version number should match the vudash instance's major version number to guarantee compatiblity.

#### package.json
```javascript
{ "name": "vudash-widget-example", "main": "widget.js" }
```
The `main` js file above should reference your main module class, in this example we call it `widget.js`

#### widget.js
```javascript
'use strict'

const moment = require('moment')

class TimeWidget {

  register (options) {
    return {

      markup: 'markup.html',
      update: 'update.js',
      schedule: 1000,

      job: (emit) => {
        const now = moment()
        emit({time: now.format('HH:mm:ss'), date: now.format('MMMM Do YYYY')})
      }

    }
  }

}

module.exports = TimeWidget
```
The main widget file. The crux of this file is to export a class with a single method, register, which returns a widget configuration, which is:

```javascript
  {
    config: {abc: 'def'}, // configuration to pass to the client and server side widget. Available in the client as `$widget.config` and `options` parameter of `register()`
    markup: 'markup.html', // The html for the widget. This is automatically wrapped in a grid cell, so it can be any html you like.
    update: 'update.js', // The method that is triggered when the `job` emits new data. This gets `$widget`, `$id`, and `$data` passed in, as detailed below.
    schedule: 1000, // Put simply, how often the widget sends updates,
    css: 'styles.css', // Or, an array of css filenames. these are rendered to the client.
    clientJs: 'client.js', // or an array of js files. These are rendered to the client.
    job: (emit) => { emit({x: 'y'}) } // The crux of the widget. Does some sort of work or check, and then emits the results.
  }
```

To pass configuration, you can use the `options` parameter of `register()`

#### update.js

The client side code to update the widget. It is wrapped in a function which contains
* `$id`: The widget's ID (For avoiding conflicts in the browser - this is in the format widget_<random> where random is some random chars assigned at load time)
* `$widget`: The widget itself, initially contains one property, `config`, which is the config you gave in `widget.js` above. You can use it as a store for anything you like, as it is namespaced to the widget you are working on. i.e. `$widget.myValue = 'x'`
* `$data`: Whatever you emit from emit() in your job method. Ideally this is a javascript object.

#### markup.html

Just html. Use `{{id}}` to get the ID of the widget mentioned above. Your html should use things like `<h1 id="{{id}}-some-thing"/>` to avoid conflicts. You can then reference them using `$id+'-some-thing'` when you need to access them from the clientside javascript.

## Troubleshooting

* Q. The console shows that the websocket is failing to connect, and my widgets aren't updating.
* A. Your hosting provider might not be correctly reporting the external vhost of the server. Add an environment variable `SERVER_URL` with the full url to your server, i.e: `http://www.example.com/`

## Roadmap
 - Heroku easy deploy
 - You, sending Pull Requests.
