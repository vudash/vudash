## Vudash transports

A data source abstraction for Vudash widgets.

### Overview

Vudash transports can be installed as a dependency of any widget to allow a user to pick from a number of sources of data.

This saves time for a widget developer, and means that any widget can easily fetch data from a number of different sources.

### Supported sources

|| Transport name || Transport Data Source || Documentation ||
|  random         | [chance.natural({ min: 0, max: 999})](http://chancejs.org) | [docs/random]
|  rest           | http(s) using [request](http://requestjs.org) | [docs/rest]
|  google-sheets  | [Google Sheets](http://drive.google.com) | [docs/google-sheets]

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
