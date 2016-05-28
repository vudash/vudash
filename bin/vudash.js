#!/usr/bin/env node

'use strict'

const cli = require('cli')
const Hoek = require('hoek')
const Path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').exec
const dashboard = require('../dashboards/template.json')
const __cwd = process.cwd()

cli.main((args, options) => {
  if (args.length === 0) {
    require('../app.js')
  }

  if (args[0] === 'create') {
    const configFile = Path.join(__cwd, 'dashboards', 'default.json')
    const packageJson = Path.join(__cwd, 'package.json')
    fs.ensureDirSync(Path.join(__cwd, 'dashboards'))
    fs.writeJsonSync(configFile, dashboard)
    fs.writeJsonSync(packageJson, { name: 'my-vudash-dashboard', main: 'vudash', scripts: { start: 'vudash' } })
    exec('npm install --save moment', (error, stdout, stderr) => {
      Hoek.assert(!error, error)
      console.log('Created sample dashboard. Run "vudash" or "npm start" to view')
    })
  }
})
