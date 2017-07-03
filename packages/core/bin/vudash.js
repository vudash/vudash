#!/usr/bin/env node

const Hoek = require('hoek')
const Path = require('path')
const fs = require('fs-extra')
const exec = require('child_process').exec
const dashboard = require('../dashboards/template.json')
const __cwd = process.cwd()

const [ , , arg ] = process.argv

if (!arg) {
  require('../app')
}

if (arg === 'create') {
  console.log('Installing dependencies. This could take a minute or two...')
  const configFile = Path.join(__cwd, 'dashboards', 'default.json')
  const packageJson = Path.join(__cwd, 'package.json')
  fs.ensureDirSync(Path.join(__cwd, 'dashboards'))
  fs.writeJsonSync(configFile, dashboard)
  fs.writeJsonSync(packageJson, { name: 'my-vudash-dashboard', main: 'vudash', scripts: { start: 'vudash' } })
  exec('npm install --save moment vudash vudash-widget-time', (error, stdout, stderr) => {
    Hoek.assert(!error, error)
    console.log('Created sample dashboard. Run "vudash" or "npm start" to view')
  })
}
