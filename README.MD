# vudash-widget-pluck

Uses [Hoek](http://npmjs.org/hoek) to pluck values from JSON APIs and display them on a [Vudash](https://npmjs.org/vudash) Dashboard

Usage
=====
Simply include in your dashboard, and configure as required:

```javascript
  {
    "widget": "vudash-widget-time",
    "options": {
      "url": "http://your.url/api/v1/something",
      "path": "some.nested.path",
      "description": "My Value"
    }
  }
```

Where `url` is the url where your API lives, `path` is the dot-path of the value you want, and description is the title which sits under the widget.

A dot-path is essentially a way of reaching a nested value, i.e for the JSON:

```javascript
  {
    "a": {
      "b": {
        "c": 'myvalue'
      }
    }
  }
```

using `a.b.c` as the path would yield `myvalue`.
