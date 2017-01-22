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

## Dashboard Events

Events can be emitted using the event emitter which is passed into the register method. These events will cause dashboard-wide actions to happen.

```
emit('audio:play', {data: data})
```

The current list of events that can be triggered are:

| Event         | Data            | Description                                                         |
| ------------- |-----------------| --------------------------------------------------------------------|
| audio:play    | `{ data: data}` | Plays an audio clip (once). `data` is a data-uri of the audio file. |


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
  }
}
```

Widgets have some optional properties:

| property name | description                          | example |
| ------------- | ------------------------------------ | ------- |
| background    | css for "background" style attribute | #ffffff |

## Creating a widget

A widget is a visible indicator of some sort of statistic or other monitor, which emits new data using websockets, and updates its display in the dashboard based on the information given in this data.

A widget is packaged as a node module, but a node module can simply be a folder with a `package.json` file. It can then contain a number of files:

## Predefined widgets

There are a series of pre-defined widgets available. These widgets are [npm packages beginning with 'vudash-widget'](https://www.npmjs.com/search?q=vudash-widget) Generally the widget's major version number should match the vudash instance's major version number to guarantee compatiblity.

### package.json
```javascript
{ "name": "vudash-widget-example", "main": "widget.js" }
```
The `main` js file above should reference your main module class, in this example we call it `widget.js`

### widget.js
```javascript
'use strict'

const moment = require('moment')

class TimeWidget {

  register (options, emit) {
    return {
      schedule: 1000,

      job: () => {
        const now = moment()
        return Promise.resolve({
          time: now.format('HH:mm:ss'),
          date: now.format('MMMM Do YYYY')
        })
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
    schedule: 1000, // Put simply, how often the widget sends updates,
    job: () => { return Promise.resolve({some: 'result'}) } // The crux of the widget. Does some sort of work or check, and then resolves with the results.
  }
```

To pass configuration, you can use the `options` parameter of `register()`

The second parameter to register is the optional parameter `emit` which can be used to emit events (at any time) to the dashboard. See `Events` below for more information about this.

### Built-in Widgets

Vudash has a number of widgets which are available on npm, these are in the `packages/` directory of the monorepo, and also available on npm.

#### CI Widget

Connects to CI Providers and displays build results

##### Screenshot
TBD

##### configuration
TBD

#### Gauge Widget

Shows a VU-Meter like Gauge which represents numerical figures like percentages

##### Screenshot
TBD

##### configuration
TBD

#### Progress Widget

Similar to VU Meter, but with a linear progress bar

##### Screenshot
TBD

##### configuration
TBD

#### Statistics Widget

Shows a statistic, which can be a number, a word, or anything else representable on screen.

Optionally can draw a graph of the previous results behind the main one.

##### Screenshot
TBD

##### configuration
TBD

#### Status Widget

Shows the status of an external service like github, or any API which uses Atlassian StatusPage

##### Screenshot
TBD

##### configuration
TBD

#### Time Widget

Simply shows the time, and has optional audiable alarams

##### Screenshot
TBD

##### configuration
TBD

#### Health Widget

A simple widget with a beating heart, to let you know that the dashboard is alive.

##### Screenshot
TBD

##### configuration
TBD

### Writing a client side component

Client side components are defined using [svelte](https://svelte.technology/) which allows you to build framework-independent client side components with ease.

There are two ways to define components, either:
 1. Multi-part: Define `vudash.markup`, `vudash.script` and `vudash.styles` in your widget's `package.json` and put your html, svelte component, and css into them respectively.
 1. Single-part: Just define `vudash.component` in your widget's package.json, and place all your svelte component's code there.

#### Example of a single part component

package.json
```json
{
  "name": "vudash-widget-health",
  "main": "widget.js",
  "vudash": {
    "component": "./component.html"
  }
}
```

component.html
```html
<h1 class="vudash-hello">{{ greeting }}</h1>
<style>
  .vudash-hello {
    text-align: right;
  }
</style>
<script>
  export default {
    data () {
      return {
        greeting: 'hello'
      }
    },

    methods: {
      /**
      * This is the really important bit. This update method is called whenever the widget emits data.
      **/
      update (data) {
        this.set(data)
      }
    }
  }
</script>
```

See the [Svelte Documentation](https://svelte.technology/guide) for information on how to build svelte components.

## Widget Transports

Transports are an easy way for widgets to get their data from a growing variety of sources. They can be considered as a data-source abstraction for Vudash widgets.

### Benefits

Vudash transports can be installed as a dependency of any widget to allow a user to pick from a number of sources of data.

This saves time for a widget developer, and means that any widget can easily fetch data from a number of different sources.

### Supported sources

| Transport name  | Transport Data Source | Documentation |
|-----------------|-----------------------|---------------|
|  value          | config ```{ value: <value> }``` | [Value Transport](#Value Transport)
|  random         | [chance.natural({ min: 0, max: 999})](http://chancejs.org) | [Random Transport](#Random Transport)
|  rest           | http(s) using [request](http://requestjs.org) | [REST Transport](#REST Transport)
|  google-sheets  | [Google Sheets](http://drive.google.com) | [Google Sheets Transport](#Google Sheets Transport)

### Usage (For developers)

1. In order to use in a widget, install the module:
  ```npm i -s vudash-transports```
2. Then simply read the `data-source` value from the widget's options, and pass it into `Transport.configure` in your widget's constructor.
  ```
  const Transport = require('vudash-transports')

  constructor (options) {
    this.transport = Transport.configure(options['data-source'])
  }
  ```
3. To fetch data, just ask the transport for it.
  ```
    this.transport.fetch()
    .then((data) => {
      // do something with data
    })
  ```

### Usage (For widget consumers)

When using a widget which uses `vudash-transports`, the consumer simply passes in the transport config:

```
  // my-dashboard.json
  {
    position: [...],
    widget: 'some-widget',
    options: {
      ...
      "data-source": {
        source: 'rest',
        config: {
          url: 'http://example.com/some/api',
          method: 'get',
          graph: 'some.nested.value'
        }
      }
    }
  }
```

where `data-source.source` is one of the supported transports listed at the top of this readme, and `data-source.config` is
the transport specific config, such as credentials for third party services, or URLs for web services, etc.

All configuration is validated by a transport method, using Joi.

### Value Transport

The Vudash Value Transport returns hardcoded values.

#### Basic Config

Simply specify the value you want returned.

```json
{
  "source": "value",
  "config": {
    "value": 2
  }
}
```

Returns the number 2.

#### Arrays and Objects

Value Transport can return anything you can provide in JSON


Simply specify the value you want returned.

```json
{
  "source": "value",
  "config": {
    "value": { "x": [{ "y": [1,2,3,4,5] }, { "z": false }] }
  }
}
```

Will return the object specified by 'value'.

### REST Transport

The Vudash REST Transport allows fetching data from external APIs.

#### Basic Config

The default method is GET. Simply specify an URL.

```json
{
  "source": "rest",
  "config": {
    "url": "http://example.com/some/api"
  }
}
```

#### POSTing data

Say you wanted to POST to the endpoint `/v1/api` at `https://example.org` on port 3333.
Furthermore, you want to send JSON request data as specified in "payload" below.

```json
{
  "source": "rest",
  "config": {
    "method": "post",
    "url": "https://example.org:3333/v1/api",
    "payload": {
      "foo": "bar",
      "one": 2,
      "three": false
    }
  }
}
```

#### Query Parameters

Say you wanted to POST to the endpoint `/v1/api` at `https://example.org` on port 3333.
Furthermore, you want to send JSON request data as specified in "payload" below.

```json
{
  "source": "rest",
  "config": {
    "method": "get", // optional
    "url": "https://example.net/v1/api",
    "query": {
      "param1":"foo",
      "param2":"bar"
    }
  }
}
```

#### Parsing data

Vudash automatically parses returned JSON which means it can be easily formatted. To determine what is returned, you can use the `graph` param to select it.

Selection is done using [Hoek.reach](https://www.npmjs.com/package/hoek), so null values, function traversal etc is automatically handled, and won't throw errors.

Say that your desired API returns the following payload in JSON:

```json
{ 
  "one": {
    "two": {
      "three": "abcde"
    }
  }
}
```

Lets say we wanted the value of "three" buried down in the middle there. It's easy:

```json
{
  "source": "rest",
  "config": {
    "url": "http://example.com/some/api",
    "graph": "one.two.three"
  }
}
```

And if you actually want the contents of two? (As an object of course):

```json
{
  "source": "rest",
  "config": {
    "url": "http://example.com/some/api",
    "graph": "one.two"
  }
}
```

### Random Transport

The Vudash Random Transport returns hardcoded values.

#### Basic Config

Vudash Random transport uses ChanceJS underneath. That means you can it bare, to generate a random integer:

```json
{
  "source": "random"
}
```

#### Custom Chance Methods

or you can define the method used to generate your random data:

```json
{
  "source": "random",
  "config": {
    "method": "string"
  }
}
```

#### Chance Methods with Custom Parameters

or you can define the method AND the parameters passed to the method. In this example, we use `chance.n()` to generate an array of values.

You need to pass parameters to `n()`, the method used to generate the values, the number of values to generarate, and the third parameter is the parameters passed to `chance.integer()`. Confused?

The code used below is the equivalent of calling [chance.n(chance.integer, 12, {min: 15, max: 32})](http://chancejs.com/#n).

```json
{
  "source": "random",
  "config": {
    "method": "n",
    "options": [
      "integer",
      12,
      [{
        min: 15,
        max: 32
      }]
    ]
  }
}
```

Generates an array of 12 integers between 15 and 32.

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
