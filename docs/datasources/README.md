# Datasources

## What is a Datasource

A datasource provides the mechanism for widgets to recieve the information they show.

## How to add a datasource to the dashboard

In this guide, we'll install the `value` datasource and use it in a widget.

1. Firstly, install the module required:
  ```
  npm install --save @vudash/datasource-value
  ```
2. Next, configure the datasource. We'll give this datasource an id of `value-datasource`, and pass it some default options. Add the datasource to your `<dashboard-name>.json` file under datasources. Don't forget to set the update schedule.
  ```
  { 
    "datasources": {
      "my-datasource-id": {
        "module": "@vudash/datasource-value",
        "schedule": 30000,
        "options": {
          "value": "12345"
        }
      }
    }
  }
  ```
3. Add the datasource to one of your widgets, by adding a `datasource` attribute to the widget's config, with the id of the datasource (`value-datasource`), in the `<dashboard-name>.json` file, this time under widgets:
```
  "widgets": [
    ...,
    { 
      "position": ...,
      "widget": "vudash-widget-statistic",
      "datasource": "my-datasource-id",
      "options": {
        "description": "Some Description"
      }
    }
  ]
```
4. You're good to go! Your widget will now use the `value-datasource` to fetch its data.

## Shared datasource configuration

When you install a datasource to the dashboard, you can pass it some configuration using the `options` attribute. This can be useful because all consumers of the datasource will receive those options:

 ```javascript
  { 
    "datasources": {
      "datasource-id": {
        "module": "some-datasource-npm-package-name",
        "options": {
          "number": 1,
          "foo": "bar"
        }
      }
    }
  }
```

## Provided Datasources

### Benefits

Vudash Datasources are referenced using the `datasource` attribute of a widget.

This saves time for a widget developer, and means that any widget can easily fetch data from a number of different sources.

### Supported sources

| Datasource name  | Source of data                                                       | Documentation                                        |
|------------------|----------------------------------------------------------------------|------------------------------------------------------|
|  value           | config ```{ value: <value> }```                                      | [Value Datasource](#value-datasource)
|  random          | [chance.natural({ min: 0, max: 999})](http://chancejs.org)           | [Random Datasource](#random-datasource)
|  rest            | http(s) using [request](http://requestjs.org)                        | [REST Datasource](#REST-datasource)
|  google-sheets   | [Google Sheets](http://drive.google.com)                             | [Google Sheets Datasource](#google-sheets-datasource)

### Usage in widgets

When using a widget which allows a datasource, just pass in the id of the datasource (registered in `datasource`), and any configuration you want it to have.

In `dashboard.json`

1. Add the datasource under the `datasource` section. The `options` will contain the configuration for the datasource:
```javascript
"datasource": {
  "datasource-id": { 
    "module": "datasource-package-name",
    "options": {
      "url": "http://example.com/some/api",
      "method": "get"
    }
  }
}
```
2. Tell the widget to use the datasource, by modifying your widget entry under `widgets`:
```javascript
  {
    "position": { ... },
    "widget": "some-widget",
    "datasource": "datasource-id",
    "options": {
      ...
    }
  }
```

Configuration is validated when the datasources are registered by the dashboard, if a datasource supports it.

### Value datasource

The Vudash Value Datasource returns hardcoded values.

#### Basic Config

Simply specify the value you want returned.

```javascript
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

```javascript
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

```javascript
{
  "module": "@vudash/datasource-rest",
  "options": {
    "url": "http://example.com/some/api"
  }
}
```

#### POSTing data

Say you wanted to POST to the endpoint `/v1/api` at `https://example.org` on port 3333.
Furthermore, you want to send JSON request data as specified in "body" below.

```javascript
{
  "module": "@vudash/datasource-rest",
  "options": {
    "method": "post",
    "url": "https://example.org:3333/v1/api",
    "body": {
      "foo": "bar",
      "one": 2,
      "three": false
    }
  }
}
```

#### Query Parameters

Say you wanted to POST to the endpoint `/v1/api` at `https://example.org` on port 3333.
Furthermore, you want to send JSON request data as specified in "query" below.

```javascript
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

Vudash automatically parses returned JSON which means it can be easily formatted. To determine what is returned, you can use a [transformer](/#/transformers) to modify the json response before the widget receives it. Consult the documentation for information on the transformers available to you and how to use them.

## Troubleshooting SSL

You might encounter an error when trying to fetch data from SSL protected servers, such as:

```bash
Error in widget datasource-rest (461305c2) { RequestError
    at ClientRequest.req.once.err (/home/aj/Projects/vudash-core/packages/core/node_modules/got/index.js:73:21)
    at Object.onceWrapper (events.js:291:19)
    at emitOne (events.js:96:13)
    at ClientRequest.emit (events.js:189:7)
    at TLSSocket.socketErrorListener (_http_client.js:358:9)
    at emitOne (events.js:96:13)
    at TLSSocket.emit (events.js:189:7)
    at emitErrorNT (net.js:1280:8)
    at _combinedTickCallback (internal/process/next_tick.js:74:11)
    at process._tickDomainCallback (internal/process/next_tick.js:122:9)
  code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  message: 'unable to verify the first certificate',
  host: 'ssl.example.com',
  hostname: 'ssl.example.com',
  method: 'GET',
  path: '/health' }

```

This means that you don't have the correct root CA certificates for node to connect to the endpoint.

This is easily fixed, if you are using node > 7.3 however:

1. Find out who the Root CA for the domain you are trying to connect to, using [an ssl analysis tool](https://sslanalyzer.comodoca.com/)
1. Download the root CA's pem file and drop it in your project folder.
1. When you run vudash, pass an environment variable with the path to your root ca's certificate, i.e: `NODE_EXTRA_CA_CERTS='./path/to/root-cas.pem' vudash`

More details on this [can be found here](https://git.daplie.com/Daplie/node-ssl-root-cas)

### Random datasource

The Vudash Random Datasource returns hardcoded values.

#### Basic Config

Vudash Random Datasource uses ChanceJS underneath. That means you can it bare, to generate a random integer:

```javascript
{
  "source": "random"
}
```

#### Custom Chance Methods

or you can define the method used to generate your random data:

```javascript
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

```javascript
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