# Developing

Creating widgets and datasources is designed to be quick and painless. They are delivered as simple npm modules, and follow basic node patterns in order to get you up to speed quickly.

## Developing Widgets

A widget is a visible indicator of some sort of statistic or other monitor, which emits new data using websockets, and updates its display in the dashboard based on the information given in this data.

A widget is packaged as a node module, but a node module can simply be a folder with a `package.json` file.

A widget is simply a node module, and really only needs a couple of files.

### package.json
```javascript
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

### Writing the server-side component
```javascript
'use strict'

const moment = require('moment')

class TimeWidget {

  constructor (options, emitter) {
    this.options = options // options is the configuration passed under "options" in your dashboard.json
    this.emitter = emitter // emitter is only useful if you want to emit events yourself (see below)
  }

  /**
   * This method is called by the datasource when it gets new data.
   **/
  update (data) {
    const now = moment()
    return {
      time: now.format('HH:mm:ss'),
      date: now.format('MMMM Do YYYY')
    } // just return the data you want to display on the dashboard
  }
}

exports.register function (options, emitter) {
  return new TimeWidget(options, emitter)
}
```
* The first parameter to register is the widget configuration given in the `dashboard.json` file
* The second parameter to register is the optional parameter `emitter` which can be used to emit events (at any time) to the dashboard. See `Events` below for more information about this.

### Writing the client side component

Client side components are defined using [svelte](https://svelte.technology/) which allows you to build framework-independent client side components with ease.

Create your svelte component as a single html file, and reference it as a module-absolute path named `vudash.component` in your widget's package.json.

In order to ease development, [a 'harness' exists](https://svelte.technology/repl?version=1.40.1&gist=0ef39c92a284251d65d1e29c63cd1ca8) for rapidly building Vudash widgets using the Svelte REPL. Edit the `widget.html` file there and then simply copy-paste it into the file you reference under `vudash.component` in `package.json`.

#### Example of a component

package.json
```javascript
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
      * This is the really important bit.
      * This update method is called whenever the widget emits data.
      *
      * data: the actual update data given by the datasource
      * meta: metadata about the update. This currently contains 'updated' which is the data fetch time.
      **/
      update ({ data, meta }) {
        this.set(data)
      }
    }
  }
</script>
```

See the [Svelte Documentation](https://svelte.technology/guide) for information on how to build svelte components.

#### Third party dependencies

All components and their dependencies are processed by `rollup` and bundled into a browser-friendly script.

You can use third party dependencies in your component by importing them using es6 import syntax. First, install the module as a dependency of your widget module:

```bash
npm install thing-maker
```

Then, import it to your component:

```html
<span>Hello {{ thing }}</span>
<script>
  import { world } from 'thing-maker'

  export default {
    data () {
      return {
        thing: world()
      }
    }
  }
</script>
```

It doesn't matter if the module you want to use isn't an es6 module (i.e. doesn't export a default object), because the `rollup` plugin [rollup-plugin-commonjs](https://www.npmjs.com/package/rollup-plugin-commonjs) is used which can convert traditional node modules into es6 modules for you.

#### Images

You can bundle SVG images as dependencies in your widgets too - the [rollup-plugin-svg](https://www.npmjs.com/package/rollup-plugin-svg) plugin is also included:

<img src="{{ logo }}" />
<script>
  import { logo } from './logo.svg'

  export default {
    data () {
      return {
        logo
      }
    }
  }
</script>

You can [read more about Rollup.js](https://rollupjs.org/) in order to better understand how to optimise your component's client side code.

## Using datasources

Datasources are how most widgets get data. Datasources provide an abstraction for fetching data from a multitude of sources, and deliver it as a single blob of json to the widgets. As a developer you should strongly consider providing datasource support in your widget.

### Benefits

  * Consumer chooses where your widget gets its data
  * Don't need to implement any data fetching code yourself
  * Focus your widget on displaying data, not fetching it
  * Shared configuration for consumers, datasources are configured globally, and/or on a widget level.

### How to

1. When a datasource emits data, it will call your Svelte component's `update` method with the data. You can then add it to your Svelte component's data model for use in the template.
```javascript
    update ({ data, meta }) {
      this.set({ someValue: data.myValue })
    }
```
1. Then simply use it in your markup
```html
<h1>{{ someValue }}</h1>
```

### Writing a component without a datasource

Your component doesn't have to use a datasource. It can simply fetch data by itself. This can be done any way you like, but an approach which works as an example is the `vudash-widget-health` widget:

```javascript
'use strict'

class HealthWidget {
  constructor (options, emitter) {
    this.emitter = emitter
    this.on = false

    this.timer = setInterval(function () {
      this.run()
    }.bind(this), options.schedule || 1000)
    this.run()
  }

  run () {
    this.on = !this.on
    this.emitter.emit('update', { on: this.on })
  }

  destroy () {
    clearInterval(this.timer)
  }
}

exports.register = function (options, emitter) {
  return new HealthWidget(options, emitter)
}
```

Important things to note here are:

* We emit our own data using `emitter`. Emitting an event called `update` with your data will result in the widget's view receving the `data` you emit into its `update({ data, meta })` method.

* We have to call our `run()` method somehow to update the data. This is done using a `setInterval`

* In case the user doesn't configure a schedule for the widget in its `options`, we default to 1000ms.

* We provide a `destroy()` hook to destroy our timer. This is useful to avoid memory leaks, unecessary fetching, and is especically useful for unit-testing.

## Dashboard Events

Events can be emitted using the event emitter which is passed into the register method. These events will cause dashboard-wide actions to happen.

```
emit('plugin', 'audio:play', {data: data})
```

The current list of events that can be triggered are:

| Event         | Data             | Description                                                         |
| ------------- |------------------| --------------------------------------------------------------------|
| audio:play    | `{ data: data }` | Plays an audio clip (once). `data` is a data-uri of the audio file. |

## Working on the Vudash project

Vudash uses
* ES6
* Svelte
* StandardJS

Contributions are always welcome, please open a PR.