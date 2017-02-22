# Predefined widgets

Vudash has a number of widgets which are available on npm, these are in the `packages/` directory of the monorepo, and also available on npm.

You will notice that widget definitions `position` and `datasource` attributes. These refer to the position of the widget on the display, and how the widget gets its data, and these are documented in [Plugins](/#/plugins) and the [Main Readme](/#/) respectively.

## CI Widget

Connects to CI Providers and displays build results.

Currently supports [CircleCI](http://www.circleci.com) and [TravisCI](http://www.travis-ci.org)

### Screenshot
TBD

### Configuration
Add to a [Vudash](https://www.npmjs.com/package/vudash) dashboard with the following configuration:

#### Simple Configuration

The simplest configuration is very straightforward

```json
  { "position": { ... },
    "widget": "vudash-widget-ci",
    "datasource": { ... },
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
TBD

### Configuration
Simply include in your dashboard, and configure as required (defaults are shown):

```javascript
  {
    "widget": "vudash-widget-statistic",
    "datasource": { ... },
    "options": {
      "schedule": 60000, // Optional. How often to refresh
      "description": "Gauge", // Optional. Description shown below statistic,
      'initial-value': 27,
      'min': 0,
      'max': 100,
      'pointer.background-colour': 'orange' // Optional, Background colour of pointer,
      'pointer.colour': 'indicatorColour', // Optional, Foreground colour of pointer.
      'value.font-size': 'valueFontSize', // Optional. Font size of gauge value.
      'value.colour': 'valueColour', // Optional. Colour of gauge value.
    }
  }
```

## Progress Widget

Similar to VU Meter, but with a linear progress bar

### Screenshot
TBD

### Configuration
TBD

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
    "datasource": { ... },
    "options": {
      "schedule": 60000, // Optional. Default 60000ms, how often to refresh
      "description": "Visitor Count", // Optional. Default "Statistics" Description shown below statistic,
      "format": "%s", // Optional. Default %s. Format the incoming data (using sprintf-js)
    }
  }
```

Note that `data-source` tells the widget where to get data, and is using the [vudash-transports plugin](https://github.com/vudash/vudash-transports/providers) to get data for your widget.

#### Graphs
This widget will graph data which is passed in as an array.

This means that if your data-source resolves an array of numbers as data, the first number in the array 
will be shown as the statistic value, and a line graph will be drawn behind the widget using the remaining numbers.

For example

`[1,2,3,4,5,6,7]` will result in a widget value of 7, and a graph of 1-6 behind it.

## Status Widget

Shows the status of an external service like github, or any API which uses Atlassian StatusPage

### Screenshot
TBD

### Configuration

Currently this widget has two integrations.

#### Atlassian Statuspage

You can configure any status page which uses [Atlassian StatusPage](https://www.atlassian.com/software/statuspage) easily:

```json
{ 
  "position": { ... }, 
  "widget": "vudash-widget-status",
  "datasource": { ... },
  "options": {
    "type": "statuspageio",
    "url": "https://status.newrelic.com/", // URL to the status page
    "components": [ // List the names of components you want to monitor the status of
      "APM",
      "Data Collection",
      "Alerts"
    ]
  }
}
```

#### Github

Github status page monitoring is pretty much no-configuration. It will tell you when it is up, down, or otherwise.

```json
{ 
  "position": { ... }, 
  "datasource": { ... },
  "widget": "vudash-widget-status",
  "options": {
    "type": "github"
  }
}
```

## Time Widget

Simply shows the time, and has optional audiable alarams

### Screenshot
TBD

### Configuration
Simply include in your dashboard:

```
  {"widget": "vudash-widget-time", "options": ...}
```

#### Alarms
This widget can play sounds! Simply pass 'alarms' into your configuration:

```
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
TBD

### Configuration

There is no configuration for this widget. It runs every second, and the heart will change shape.

If the heart stops... your vudash client's websocket has become disconnected from the backend, and your data is out of date.