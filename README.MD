A Vudash widget for CI builds.

Usage
=====

Add to a [Vudash](https://www.npmjs.com/package/vudash) dashboard with the following configuration:

```javascript
      {
        "widget": "vudash-widget-ci",
        "options": {
          "provider": "travis", // CI Provider (travis or circleci)
          "user": "your-user", // username, mandatory
          "repo": "your-repo", // repository name, mandatory
          "branch": "your-branch" // branch to monitor, optional.
          "schedule": 60000 // Update frequency in MS (optional),
          "options": {
            "auth": "xxx" // circleci auth token, only required for circleci
          }
        }
      }
```

Where `your-user` is your github organisation or user name, and `your-repo` is your build/repository name.

* The travis plugin currently only deals with private repositories

Developing
==========
Check the project out, make your changes, and use `npm test` to run tests.

npm link into a dashboard for live-reload fun.
