'use strict'

exports.build = function (widgets) {
  const model = widgets.reduce((curr, { id, name, options, markup, css, js, componentPath }) => {
    curr.childComponents.add(name)
    curr.imports.add(`import ${name} from '${componentPath}'`)
    curr.containers.push(markup)
    curr.css.push(css)
    curr.events.push(js)
    curr.config[id] = options
    return curr
  }, {
    childComponents: new Set(['App']),
    imports: new Set(),
    containers: [],
    events: [],
    css: [],
    config: {}
  })

  function renderWidget (id, name, config) {
    return `
      <div id="widget-container-${id}" class="widget-container">
        <${name} ref:${id} config="${config}" />
      </div>
    `
  }

  const component = `
    <App />
    ${model.childComponents.map(name => renderWidget())}

    <style>
      ${model.css.join('\n')}
    </style>

    <script>
      'use strict'
      
      import App from '../components/app/component.html'
      ${[ ...model.imports ].join('\n')}

      ${model.events.join('\n')}

      export default {
        data: {
          return () {
            config: ${JSON.stringify(model.config)}
          }
        }

        components: {
          ${[ ...model.childComponents ].join(',\n')}
        }
      }
    </script>
  `
  console.log(component)
  return component
}
