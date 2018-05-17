# Transformers

Transformers allow you to retrieve information from a data source or widget, and modify it before it is sent to the dashboard.

## How to install a transformer

Transformers, like widgets and datasources, are just node modules. Install the module required:

```bash
npm install --save @vudash/transformer-map
```

## Provided Transformers

We provide a selection of transformers, or you can [write your own](/#/developers), very simply.

### Map Transformer (@vudash/transformer-map)

Maps json data from one structure to another.

Selection is done using [Hoek.reach](https://www.npmjs.com/package/hoek) via [reorient](https://www.npmjs.com/package/reorient), so null values, function traversal etc is automatically handled, and won't throw errors.

You should consult the [reorient](https://www.npmjs.com/package/reorient) documentation for advanced mapping features such as default values, but in a pinch:

Say that your desired API returns the following payload in JSON:

```javascript
{ 
  "one": {
    "two": {
      "three": "abcde"
    }
  }
}
```

Lets say we wanted the value of "three" buried down in the middle there. It's easy:

```javascript
{
  "position": {
    ...
  },
  "datasource": "ds-rest",
  "transformations": [
    {
      "transformer": "@vudash/transformer-map",
      "options": {
        "value": "one.two.three"
      }
    }
  ],
  "options": {
    "description": "Value of three"
  },
  "widget": "vudash-widget-statistic"
}
```

And if you actually want the contents of two? (As an object of course):

```javascript
{
  "position": {
    ...
  },
  "datasource": "ds-rest",
  "transformations": [
    {
      "transformer": "@vudash/transformer-map",
      "options": {
        "value": "one.two"
      }
    }
  ],
  "options": {
    "description": "Value of two"
  },
  "widget": "vudash-widget-statistic"
}
```

### JQ Transformer (@vudash/transformer-jq)

The JQ transformer uses the module [jq.node](https://www.npmjs.com/package/jq.node), which is an 'improved, faster' version of jq specifically for node.

Usage is a matter of compiling a selector to modify the data as you please

Supposing your data looks like this:

```json
{
  "a": {
    "big": {
      "json": {
        "jeff": {
          "email": "jeff@example.net"
        },
        "joe": {
          "phone": "+447721981546"
        },
        "emma": {
          "email": "emma@example.com"
        },
        "grayson": {
          "email": "wailo@example.net"
        }
      }
    } 
  }
}
```

You could use the following configuration to group the above users by email domain.

```javascript
{
  "position": {
    ...
  },
  "datasource": "ds-rest",
  "transformations": [
    {
      "transformer": "@vudash/transformer-jq",
      "options":  {
        "value": "filter(has('email')) | groupBy(flow(get('email'), split('@'), get(1)))"
      }
    }
  ],
  "options": {
    "description": "People grouped by email domain"
  },
  "widget": "vudash-widget-statistic"
}
```