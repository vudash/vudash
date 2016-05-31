A Vudash widget for travis builds.

Screenshot
==========



Usage
=====

Add to a (Vudash)[https://www.npmjs.com/package/vudash] dashboard with the following configuration:

```javascript
      {
        "widget": "vudash-widget-travis",
        "options": {
          "user": "your-user",
          "repo": "your-repo"
        }
      }
```

Where `your-user` is your github organisation or user name, and `your-repo` is your build/repository name.

Developing
==========
Check the project out, make your changes, and use `npm test` to run tests.

npm link into a dashboard for live-reload fun.
