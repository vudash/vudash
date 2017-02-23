# Developing

Creating widgets and plugins is designed to be quick and painless. They are delivered as simple npm modules, and follow basic node patterns in order to get you up to speed quickly.

## Developing Widgets

A widget is a visible indicator of some sort of statistic or other monitor, which emits new data using websockets, and updates its display in the dashboard based on the information given in this data.

A widget is packaged as a node module, but a node module can simply be a folder with a `package.json` file. It can then contain a number of files:

Building a widget is simply a node module, and really only needs a couple of files.

### package.json
```json
  { 
    "name": "vudash-widget-example", 
    "main": "widget.js",
    "vudash": {
      "component": "somefile.html"
    }
  }
```
The `main` js file above should reference your main module class, in this example we call it `widget.js`

The `vudash.component` is a single file [SvelteJS](http://svelte.technology) component that is an all-in-one (html, css, js),
view-component with an immutable-data-tree based state model.

### widget.js
```javascript
'use strict'

const moment = require('moment')

class TimeWidget {

  register (options, emit) {
    return {
      /* How often the job should run */
      schedule: options.schedule || 1000,

      /* This is run every ^schedule, and the resolved promise's value is sent to the client */
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
* The first parameter to register is the widget configuration given in the `dashboard.json` file
* The second parameter to register is the optional parameter `emit` which can be used to emit events (at any time) to the dashboard. See `Events` below for more information about this.

### Writing the client side component

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

### Writing the server part of the component

The server-side component of a widget consists of a simple single class which exposes methods and configuration the dashboard can call.

A simple widget example is that of the time widget:

```
class HealthWidget {

  register (options) {
    let on = false

    return {
      schedule: options.schedule || 1000,

      job: () => {
        on = !on
        const classes = on ? '' : 'small'
        return Promise.resolve({ classes })
      }

    }
  }

}

module.exports = HealthWidget
```

The important parts here are:

 * The register method, which is called when the widget is registered on a dashboard. The register method actually takes three parameters:
  * `options`: which are the options passed when the widget was registered in `<dashboard-name>.json`. This is your widget's configuration. It's worth validating it.
  * `emitter`: which is the hosting dashboard's event emitter. See the [Events](# Dashboard Events) section for further details.
  * `datasource`: which is a datasource (optional, and possibly null depending on the widget's configuration in `<dashboard-name>.json`). See [Datasources](# Using datasources) below for more details on how datasources work and why you should use them.
 * The object returned, which should have the following properties:
  * `schedule`: the frequencey, in milliseconds, that the `job()` method should be run. You should allow this to be overriden using config (see example).
  * `job`: which is the method which fetches data, does some sort of logic to transform the data, and returns the data to the client as json. It must *always* return a promise.

That's about it. Widgets are intentionally simple.

## Using datasources

Datasources are how most widgets get data. Datasources provide an abstraction for fetching data from a multitude of sources, and deliver it as a single blob of json to the widgets. As a developer you should strongly consider providing datasource support in your widget.

### Benefits

  * Two lines of code to retrieve data from any datasource
  * Consumer chooses where your widget gets its data
  * Don't need to implement any data fetching code yourself
  * Focus your widget on displaying data, not fetching it
  * Shared configuration for consumers, datasources are configured globally, and/or on a widget level.

### How to

```
1. Use the `datasource` parameter passed during widget construction.
```
 class YourWidget {
   register (options, emit, datasource) {
     ...
   }
 }
```
1. To fetch data, just ask the Datasource for it.
```
    datasource.fetch()
    .then((data) => {
      // do something with data
    })
```

## Dashboard Events

Events can be emitted using the event emitter which is passed into the register method. These events will cause dashboard-wide actions to happen.

```
emit('audio:play', {data: data})
```

The current list of events that can be triggered are:

| Event         | Data             | Description                                                         |
| ------------- |------------------| --------------------------------------------------------------------|
| audio:play    | `{ data: data }` | Plays an audio clip (once). `data` is a data-uri of the audio file. |

## Developing Plugins

Read about plugins here [/#/plugins]

Plugins actually only expose one single method from their main index file, `register(engine)`. `engine` is a `PluginRegistration` component which provides access to a number of methods for contributing functionality to the dashboard. You should implement your register method along the following lines:

```
class SomePlugin {
  register (engine) {
    engine.<someMethod>(<params>)
  }
}
```

What `someMethod` and `params` are can vary depending on what functionality you want to contribute, and are documented in the following sections.

### contributeDatasource(DatasourceConstructor, validation)

`DatasourceConstructor` is a simple ES6 class which has one public method, `fetch()` which is what a consuming component will call in order to retrieve data. It takes no parameters. It must return a promise.

`validation` is a [Joi](http://npmjs.com/joi) schema which validates configuration passed during plugin registration (i.e. via `plugins.<plugin-id>.options` or via `widgets[].datasource.options` in `dashboard.json`)

A simple (but pointless) use of `contributeDatasource` could be:

```
class MyDataSource {
  fetch () {
    return Promise.resolve('some-value')
  }
}

const myValidation = Joi.object().required()

class SomePlugin {
  register (engine) {
    engine.contributeDatasource(MyDataSource, myValidation)
  }
}
```

See some of the real datasources for better examples.

## Working on the Vudash project

Vudash uses
* ES6
* Svelte
* StandardJS

Contributions are always welcome, open a PR.