# Predefined widgets

Vudash has a number of widgets which are available on npm, these are in the `packages/` directory of the monorepo, and also available on npm.

You will notice that widget definitions `position` and `datasource` attributes. These refer to the position of the widget on the display, and how the widget gets its data, and these are documented in [Datasources](/#/datasource) and the [Main Readme](/#/) respectively.

## Chart Widget

Shows Bar, Line, Chart, and Donut graphs for data series.

### Screenshot

Line Chart

![line-chart](https://cloud.githubusercontent.com/assets/218949/25781884/57c8d264-3337-11e7-8e46-ae6737d20f50.png)

### Configuration

The chart widget has a number of configuration options:

| Option | Default | Allowed Values | Description |
| --- | --- |
| `description` | `<empty string>` | any string | Widget description, shown at the bottom of the widget
| `type` | `line` | `line, bar, pie, donut` | Graph type. Lowercased version of [chartist graph types](https://gionkunz.github.io/chartist-js/examples.html). Also applies some sensible styling to each graph type to make it fit with a Vudash dashboard. |
| `labels` | `[]` | an array of label names | Labels which run along the X axis of a chart. Each label relates to its corresponding number in the data provided to the chart. |

#### Configuration example

You can configure any status page which uses [Atlassian StatusPage](https://www.atlassian.com/software/statuspage) easily:

```javascript
{ 
  "position": { ... }, 
  "widget": "@vudash/widget-chart",
  "datasource": { ... },
  "options": {
    "type": "pie",
    "description": "My Pie Chart",
    "labels": ["Apples", "Pears", "Peaches", "Lemons", "Oranges"]
  }
}
```

## CI Widget

Connects to CI Providers and displays build results.

Currently supports [CircleCI](http://www.circleci.com) and [TravisCI](http://www.travis-ci.org)

### Screenshot

Building:

![ci-widget 1](https://cloud.githubusercontent.com/assets/218949/25973853/c90fe034-369d-11e7-80ef-639126d7e1dd.gif)

Failing, and Passing:

![ci-widget](https://cloud.githubusercontent.com/assets/218949/25781907/d0242da8-3337-11e7-904d-9c6f00b7ea27.gif)

### Configuration
Add to a [Vudash](https://www.npmjs.com/package/vudash) dashboard with the following configuration:

#### Simple Configuration

The simplest configuration is very straightforward

```javascript
  { "position": { ... },
    "widget": "vudash-widget-ci",
    "datasource": "some-data-source-id",
    "options": {
      "provider": "circleci",
      "repo": "some-repo",
      "user": "some-user"
    }
  }
```

#### Build Noises

```javascript
      {
        "widget": "vudash-widget-ci",
        "options": {
          "provider": "travis", // CI Provider (travis or circleci)
          "user": "your-user", // username, mandatory
          "repo": "your-repo", // repository name, mandatory
          "branch": "your-branch" // branch to monitor, optional.
          "schedule": 60000 // Update frequency in MS (optional),
          "sounds": { // Sound to play on build state changes (optional)
            "passed": "/some/local/path/sound.ogg",
            "failed": "data:audio/ogg;base64, ...",
            "unknown": "data:audio/ogg;base64, ..."
          },
          "options": {
            "auth": "xxx" // circleci auth token, only required for circleci
          }
        }
      }
```

Where `your-user` is your github organisation or user name, and `your-repo` is your build/repository name.

* The travis plugin currently only deals with public repositories (i.e. travis-ci.org, not .com)

## Gauge Widget

Shows a VU-Meter like Gauge which represents numerical figures like percentages

### Screenshot

![gauge-widget](https://cloud.githubusercontent.com/assets/218949/25781923/339cd844-3338-11e7-8e12-0ff197e3876f.gif)

### Configuration
Simply include in your dashboard, and configure as required (defaults are shown):

```javascript
  {
    "widget": "vudash-widget-statistic",
    "datasource": "some-data-source-id",
    "options": {
      "description": "Gauge", // Optional. Description shown below statistic,
      "initial-value": 27,
      "min": 0,
      "max": 100,
      "pointer.background-colour": "orange" // Optional, Background colour of pointer,
      "pointer.colour": "indicatorColour", // Optional, Foreground colour of pointer.
      "value.font-size": "valueFontSize", // Optional. Font size of gauge value.
      "value.colour": "valueColour", // Optional. Colour of gauge value.
    }
  }
```

## Progress Widget

Similar to VU Meter, but with a linear progress bar

### Screenshot

![progress](https://cloud.githubusercontent.com/assets/218949/25974011/81164970-369e-11e7-83b3-c42e87febabb.png)

### Configuration

The only configuration for the progress widget is the description.

```javascript
  {
    "widget": "vudash-widget-progress"
    "datasource": "some-data-source-id",
    "options": {
      "description": "Stuff", // Optional. Default "Progress" Description shown below statistic
    }
  }
```

The datasource connected to the progress widget should ideally return numbers between 1 and 100, anything over 100 will be represented as 100% anyway.

## Statistics Widget

Shows a statistic, which can be a number, a word, or anything else representable on screen.

Optionally can draw a graph of the previous results behind the main one.

### Screenshot
![stats widget](https://cloud.githubusercontent.com/assets/218949/20489789/adb964ca-b003-11e6-917b-c07218625bd3.png)

### Configuration
Simply include in your dashboard, and configure as required:

```javascript
  {
    "widget": "vudash-widget-statistic",
    "datasource": "some-data-source-id",
    "options": {
      "description": "Visitor Count", // Optional. Default "Statistics" Description shown below statistic,
      "format": "%s", // Optional. Default %s. Format the incoming data (using sprintf-js),
      "font-ratio": 4 // Optional. Default 4. Scaling ratio for main statistic (for longer text, increase this number),
      "colour": "#86797d" // Optional. Defaults to a random colour from a pre-selected "pretty" list. Colour for line / fill-area of graph, if shown.
    }
  }
```

Note that `datasource` tells the widget how to get data, and is using a datasource, which is documented in the [Datasources documentation](/#/datasources)

#### Graphs
This widget will graph data which is passed in as an array.

This means that if your data-source resolves an array of numbers as data, the last number in the array 
will be shown as the statistic value, and a line graph will be drawn behind the widget using the remaining numbers.

For example

`[1,2,3,4,5,6,7]` will result in a widget value of 7, and a graph of 1-6 behind it.

## Status Widget

Shows the status of an external service like github, or any API which uses Atlassian StatusPage

### Screenshot

![status-widget](https://cloud.githubusercontent.com/assets/218949/25781933/62f3e344-3338-11e7-9cf8-dc7b29aa1a98.png)

### Configuration

Currently this widget has two integrations.

#### Atlassian Statuspage

You can configure any status page which uses [Atlassian StatusPage](https://www.atlassian.com/software/statuspage) easily:

```javascript
{ 
  "position": { ... }, 
  "widget": "vudash-widget-status",
  "datasource": "some-data-source-id",
  "options": {
    "schedule": 300000,
    "type": "statuspageio",
    "config": {
      "url": "https://status.newrelic.com/", // URL to the status page
      "components": [ // List the names of components you want to monitor the status of
        "APM",
        "Data Collection",
        "Alerts"
      ]
    }
  }
}
```

#### Github

Github status page monitoring is no-configuration. It will tell you when it is up, down, or otherwise.

```javascript
{ 
  "position": { ... }, 
  "datasource": "some-data-source-id",
  "widget": "vudash-widget-status",
  "options": {
    "schedule": 300000,
    "type": "github"
  }
}
```

## Time Widget

Simply shows the time, and has optional audiable alarams

### Screenshot
![time-widget](https://cloud.githubusercontent.com/assets/218949/25781881/50fffa66-3337-11e7-89dc-12871a2350b8.png)

### Configuration
Simply include in your dashboard:

```javascript
  {
    "widget": "vudash-widget-time",
    "options": { ... }  
  }
```

#### Timezone support
The timezone can be set via configuration. The list of allowed timezones is that of the `moment-timezone` library.

```javascript
  "options": {
    "timezone": "Europe/London"
  }
```

#### Alarms
This widget can play sounds! Simply pass 'alarms' into your configuration:

```javascript
  "options": {
    "alarms": [
      {
        "expression": "5 * * * * *",
        "actions": [
          {
            "action": "sound",
            "options": {
              "data": "data:audio/ogg;base64, ..."
            }
          }
        ]
      }
    ]
  }
```

`expression` is a cron expression which determines when the sound will be played.
`actions` is the action to perform when the alarm is triggered. Supported actions are listed below:

#### Actions
Action: `sound`
Options: `data` is a data-uri which contains the clip of audio to be played. You can use a tool like: `http://dopiaza.org/tools/datauri/index.php` to convert your audio clips to data-uris.

## Health Widget

A simple widget with a beating heart, to let you know that the dashboard is alive.

### Screenshot

![health-widget](https://cloud.githubusercontent.com/assets/218949/25781948/a0314bfc-3338-11e7-99a9-3d81065b0518.png)

### Configuration

There is no configuration for this widget. It runs every second, and the heart will change shape.

If the heart stops... your vudash client's websocket has become disconnected from the backend, and your data is out of date.
