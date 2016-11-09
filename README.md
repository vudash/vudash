# vudash-widget-time

Shows the current time and date in your [Vudash](https://npmjs.org/vudash) Dashboard

## Usage
Simply include in your dashboard:

```
  {"widget": "vudash-widget-time", "options": ...}
```

## Alarms
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

### actions

#### sound
Action: `sound`
Options: `data` is a data-uri which contains the clip of audio to be played. You can use a tool like: `http://dopiaza.org/tools/datauri/index.php` to convert your audio clips to data-uris.
