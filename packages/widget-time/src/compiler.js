'use strict'

const fs = require('fs')

const script = fs.readFileSync('./src/client/client.js', 'utf8')
const markup = fs.readFileSync('./src/client/markup.html', 'utf8')
const styles = fs.readFileSync('./src/client/client.css', 'utf8')

const component = `
${markup}
<style>
${styles}
</style>
<script>
${script}
</script>
`

fs.writeFileSync('./.compiled.html', component)