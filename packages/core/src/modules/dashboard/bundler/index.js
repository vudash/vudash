'use strict'

exports.build = function (widgets) {
  const model = widgets.reduce((curr, { name, markup, css, js, componentPath }) => {
    curr.imports.push(`import ${name} from '${componentPath}'`)
    curr.containers.push(markup)
    curr.css.push(css)
    curr.events.push(js)
    return curr
  }, { imports: [], containers: [], events: [], css: [] })

  const imports = [ ...new Set(model.imports) ]

  const component = `
    <App />
    ${model.containers.join('\n')}

    <style>
      ${model.css.join('\n')}
    </style>

    <script>
      'use strict'
      
      import 'App' from '../components/app/component.html'
      ${imports.join('\n')}

      ${model.events.join('\n')}
    </script>
  `
  return component
}
