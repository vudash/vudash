'use strict'

const { compile } = require('./compiler')
const Css = require('json-to-css')

function renderWidget (id, name) {
  return `
    <div id="widget-container-${id}" class="widget-container">
      <${name} ref:r${id} config="{{ config[id] }}" />
    </div>
  `
}

exports.render = async function ({ name, widgets, layout, additionalCss }) {
  const { markup, css, events, components } = widgets.reduce((curr, widget) => {
    const { id, name, js } = widget

    curr.components[name] = componentPath
    curr.markup.push(renderWidget(id, name, config))
    curr.events.push(js)
    curr.css.push(css)
    curr.config[id] = config

    return curr
  }, { markup: [], css: [], events: [], components: {}, config: {} })

  console.log(config)

  const source = `
    ${markup.join('\n')}

    <style>
      ${css.join('\n')}
    </style>

    <script>
      import '__additional_css__'
      ${Object.keys(components).map(i => `import ${i} from '${components[i]}'\n`)}

      export default {
        data () {
          return ${config}
        }

        oncreate () {
          ${events.join('\n')}
        }

        components: {
          ${Object.keys(components).join(',\n')}
        }
      }
    </script>
  `

  return compile(source, Css.of(additionalCss))
}
