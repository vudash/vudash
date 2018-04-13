# API

Vudash exposes a very simple RESTful HTTP versioned api which can be used to perform a number of operations on a running dashboard.

## Versioning

API endpoints are versioned in their url. Current versions are:

`/api/v1`

## Authentication

### Authenticating Requests

Authentication to the api is performed by passing an `api-key` parameter as either a `header` or a `request parameter`, i.e:

```bash
curl -X GET 'http://your.dashboard.url:3300/api/v1/something/to-do?api-key=abcde12345'
```

or

```bash
curl -X GET --header 'api-key: abcde12345' 'http://your.dashboard.url:3300/api/v1/something/to-do'
```

### API Keys

By default, an api key is generated and output to the console when the dashboard loads. However, you can override this api key with the `API_KEY` environment variable, i.e:

```bash
$ API_KEY=abcde12345 vudash
```

## Endpoints

Below is a list of operations which can be peformed via the API. This list will grow over time

### PUT /api/v1/view/current

Change which dashboard viewers are seeing. This affects *all viewers* of any dashboard, so use it wisely.

Possible uses for this endpoint are if you only have a single screen but need multiple dashboards - you can set up a simple cron-job to change the dashboard every N minutes.

Another use for this is to set up some sort of IoT button (or a [hacked Amazon Dash button](https://www.npmjs.com/package/homebridge-dash)), to allow your team to view different dashboards on a single screen by pressing a button.

### PUT /api/v1/dashboards/{name}

Dynamically add a new dashboard to vudash (or replace an existing one of the same `{name}`).

This way, you can add dashboards to a running instance of vudash without redeploying.

You pass a payload containing a single key `descriptor`, which contains a dashboard descriptor (the same as you would add a dashboard normally as {name}.json)

An example payload might be:

```json
{
	"descriptor": {
		"name": "my-dynamic-dashboard",
		"layout": {
			"columns": 2,
			"rows": 2
		},
		"datasources": {
			"ds-rnd": {
				"module": "../datasource-random",
				"schedule": 1000,
				"options": {
					"method": "natural",
					"options": {
						"max": 100000
					}
				}
			}
		},
		"widgets": [{
			"position": {
				"x": 0,
				"y": 0,
				"w": 2,
				"h": 2
			},
			"widget": "../widget-statistic",
			"datasource": "ds-rnd"
		}]
	}
}
```

You can then visit the new dashboard as you normally would at `http://<vudash-url>/<name>.dashboard`.

Note that dynamically added dashboards are *in memory* and do not survive server restarts.

If you are adding a new dashboard (i.e. `{name}` is unique), the api will return http status code `201`. If you are replacing an existing one (even one which exists on disk), you will recieve a `200` http status code