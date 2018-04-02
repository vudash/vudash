'use strict'

exports.renderScript = function (id, name, config) {
  return `
    <div id="widget-container-${id}" class="widget-container">
      <${name} ref:r${id} config="{{ config }}" />
    </div>

    <script>
      export default {
        data () {
          return {
            config: ${JSON.stringify(config)}
          }
        }

        oncreate () {
          socket.on('${id}:update', $data => {
            if ($data.error) {
              console.error('Widget "${id}" encountered error: ' + $data.error.message)
            }
            this.refs.r${id}.update($data)
          })
        }
      }
    </script>
  `
}

exports.renderStyles = function (id, widgetPosition, background) {
  const { top, left, width, height } = widgetPosition
  const rules = [
    `top:${top}%`,
    `left:${left}%`,
    `width:${width}%`,
    `height:${height}%`
  ]

  if (background) {
    rules.push(`background:${background}`)
  }

  return `#widget-container-${id}{${rules.join(';')}}`
}
