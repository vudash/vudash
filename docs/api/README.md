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
