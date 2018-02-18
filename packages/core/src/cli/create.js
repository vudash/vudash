'use strict'

const npm = require('npm-programmatic')
const ora = require('ora')
const Path = require('path')
const fs = require('fs-extra')

const { green } = require('chalk')

exports.run = function () {
  const dashboard = require('../../dashboards/template.json')
  const cwd = process.cwd()
  const spinner = ora().start('Creating dashboard layout')
  const configFile = Path.join(cwd, 'dashboards', 'default.json')
  const packageJson = Path.join(cwd, 'package.json')
  const dashboardsDir = Path.join(cwd, 'dashboards')

  fs.ensureDirSync(dashboardsDir)
  fs.writeJsonSync(packageJson, {
    name: 'my-vudash-dashboard',
    main: 'vudash',
    scripts: { start: 'vudash' },
    'engines': {
      'node': '>=9.x'
    }
  })
  fs.writeJsonSync(configFile, dashboard)
  spinner.succeed('Created dashboard layout')
  spinner.start('Installing dependencies. This could take a minute or two...')

  npm.install([
    'vudash',
    'vudash-widget-time'
  ], {
    cwd,
    save: true
  })
  .then(() => {
    spinner.succeed('Installed dependencies.')
    console.log(
      green(
        'Created sample dashboard. Run "vudash" or "npm start" to view'
      )
    )
  })
  .catch(e => {
    spinner.fail('Failed to install some dependencies.')
    console.log(e)
  })
}
