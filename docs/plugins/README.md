# Plugins

## What is a Plugin

A plugin is a way of contributing behaviour to vudash, such as a way to obtain data, or an extra action that widgets can perform.

Datasources are a good example of plugins, as they provide the mechanism for widgets to recieve the information they show.

## What can a Plugin do

Currently, plugins can contribute the following behaviour

* Add a datasource

## How to add a plugin to the dashboard

In this guide, we'll install the `value` datasource and use it in a widget.

1. Firstly, install the module required:
  ```
  npm install --save @vudash/datasource-value
  ```
2. Next, configure the plugin. We'll give this plugin an id of `value-datasource`, and pass it some default options. Add the plugin to your `<dashboard-name>.json` file under plugins
  ```
  { 
    "plugins": {
      "value-datasource": {
        "module": "@vudash/datasource-value",
        "options": {
          "value": "12345"
        }
      }
    }
  }
  ```
3. Add the datasource to one of your widgets, by adding a `datasource` attribute to the widget's config, with the id of the plugin (`value-datasource`), and optionally, some options - in this instance, we won't add any. Again, in the `<dashboard-name>.json` file, this time under widgets:
```
  "widgets": [
    ...,
    { 
      "position": ...,
      "widget": "vudash-widget-statistic",
      "datasource": {
        "name": "value-datasource"
      },
      "options": {
        "schedule": 30000,
        "description": "Some Description"
      }
    }
  ]
```
4. You're good to go! Your widget will now use the `value-datasource` to fetch its data.

## Shared plugin configuration

When you install a plugin to the dashboard, you can pass it some configuration using the `options` attribute. This can be useful because all consumers of the plugin will receive those options:

 ```
  { 
    "plugins": {
      "plugin-id": {
        "module": "some-plugin-npm-package-name",
        "options": {
          "number": 1,
          "foo": "bar"
        }
      }
    }
  }
  ```

When you use a plugin, the options you pass there are merged (and will override) the defaults passed in the `plugins` block (shown above)

Note that we override `options.number` below:

```
  "widgets": [
    ...,
    { 
      "position": ...,
      "widget": "vudash-widget-statistic",
      "datasource": {
        "name": "value-datasource",
        "options": {
          "number": 2
        }
      },
      ...
    }
  ]
```

The final configuration for the datasource will be:

```
  options: {
    number: 2,
    foo: "bar"
  }
```

Both sets of options are optional.

## Built in Plugins

## Datasources

Datasources are an easy way for widgets to get their data from a growing variety of sources.

### Benefits

Vudash Datasources are installed as plugins, then referenced using the `datasource` attribute of a widget.

This saves time for a widget developer, and means that any widget can easily fetch data from a number of different sources.

### Supported sources

| Datasource name  | Source of data                                                       | Documentation                                        |
|------------------|----------------------------------------------------------------------|------------------------------------------------------|
|  value           | config ```{ value: <value> }```                                      | [Value Datasource](#value-datasource)
|  random          | [chance.natural({ min: 0, max: 999})](http://chancejs.org)           | [Random Datasource](#random-datasource)
|  rest            | http(s) using [request](http://requestjs.org)                        | [REST Datasource](#REST-datasource)
|  google-sheets   | [Google Sheets](http://drive.google.com)                             | [Google Sheets Datasource](#google-sheets-datasource)

### Usage in widgets

When using a widget which allows a datasource, just pass in the id of the datasource (registered in `plugins`), and any configuration you want it to have.

In `dashboard.json`

1. Add the datasource plugin under `plugins`:
```
"plugins": {
  "plugin-id": { 
    "module": "plugin-package-name"
  }
}
```
2. Tell the widget to use the datasource:
```
  {
    "position: { ... },
    "widget: "some-widget",
    "datasource: {
      "name: "plugin-id",
      "options: {
        "url": "http://example.com/some/api",
        "method": "get",
        "graph": "some.nested.value"
      }
    },
    "options": {
      ...
    }
  }
```

`datasource.options` will contain the configuration for the datasource plugin.

You can put the datasource `options` under either the plugin's config, or the widget's datasource config. The widget's datasource config will override any values from the plugin's config (for that widget only).

Configuration is validated when the widgets are registered by the dashboard, if the datasource plugin supports it.

### Value datasource

The Vudash Value Datasource returns hardcoded values.

#### Basic Config

Simply specify the value you want returned.

```json
{
  "module": "@vudash/datasource-value",
  "options": {
    "value": 2
  }
}
```

Returns the number 2.

#### Arrays and Objects

Value Datasource can return anything you can provide in JSON


Simply specify the value you want returned.

```json
{
  "module": "@vudash/datasource-value",
  "options": {
    "value": { "x": [{ "y": [1,2,3,4,5] }, { "z": false }] }
  }
}
```

Will return the object specified by 'value'.

### REST datasource

The Vudash REST Datasource allows fetching data from external APIs.

#### Basic Config

The default method is GET. Simply specify an URL.

```json
{
  "module": "@vudash/datasource-rest",
  "options": {
    "url": "http://example.com/some/api"
  }
}
```

#### POSTing data

Say you wanted to POST to the endpoint `/v1/api` at `https://example.org` on port 3333.
Furthermore, you want to send JSON request data as specified in "payload" below.

```json
{
  "module": "@vudash/datasource-rest",
  "options": {
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
  "module": "@vudash/datasource-rest",
  "options": {
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
  "module": "@vudash/datasource-rest",
  "options": {
    "url": "http://example.com/some/api",
    "graph": "one.two.three"
  }
}
```

And if you actually want the contents of two? (As an object of course):

```json
{
  "module": "@vudash/datasource-rest",
  "options": {
    "url": "http://example.com/some/api",
    "graph": "one.two"
  }
}
```

### Random datasource

The Vudash Random Datasource returns hardcoded values.

#### Basic Config

Vudash Random Datasource uses ChanceJS underneath. That means you can it bare, to generate a random integer:

```json
{
  "source": "random"
}
```

#### Custom Chance Methods

or you can define the method used to generate your random data:

```json
{
  "module": "@vudash/datasource-random",
  "options": {
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
  "module": "@vudash/datasource-random",
  "options": {
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