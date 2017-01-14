[![Join the chat at https://gitter.im/vudash/vudash-core](https://badges.gitter.im/vudash/vudash-core.svg)](https://gitter.im/vudash/vudash-core?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/vudash/vudash-core.svg?branch=master)](https://travis-ci.org/vudash/vudash-core) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# Vudash
A dashboard, like dashing, but written in NodeJS.

## Documentation

Documentation has moved [here](http://vudash.github.io/vudash-core/)

## What does it look like?

![dashboard](https://cloud.githubusercontent.com/assets/218949/18632967/05d72ba6-7e72-11e6-964d-6de1f38135ac.png)
![graph](https://cloud.githubusercontent.com/assets/218949/18608448/68c9bf90-7ce1-11e6-95a9-15c864722271.png)

## Demo

http://vudash.herokuapp.com/demo.dashboard

## Features
* will happily run on a free heroku instance
* es6
* all cross-origin requests done server side
* websockets rather than polling
* websocket fallback to long-poll when sockets aren't available
* Custom widgets
* Custom dashboards
* Simple row-by-row layout
* Dashboard arrangement is simply the config order (see below)
* Super simple widget structure