'use strict'

exports.build = function (widgets) {
  const model = widgets.reduce((curr, { name, markup, css, js, componentPath }) => {
    curr.childComponents.add(name)
    curr.imports.add(`import ${name} from '${componentPath}'`)
    curr.containers.push(markup)
    curr.css.push(css)
    curr.events.push(js)
    return curr
  }, { childComponents: new Set(['App']), imports: new Set(), containers: [], events: [], css: [] })

  const component = `
    <App />

    <style>
      ${model.css.join('\n')}
    </style>

    <script>
      'use strict'
      
      import App from '../components/app/component.html'
      ${[ ...model.imports ].join('\n')}

      ${model.events.join('\n')}

      export default {
        components: {
          ${[ ...model.childComponents ].join(',\n')}
        }
      }
    </script>
  `
  console.log(component)
  return component
}
