'use strict'

const renderer = require('.')

/**
 * ${code}

      var widget_${id} = new ${name}({
        target: document.getElementById("widget-container-${id}"),
        data: { config: ${JSON.stringify(config)} }
      });

      socket.on('${id}:update', function($id, $widget, $data) {
        if ($data.error) {
          console.error('Widget "${id}" encountered error: ' + $data.error.message);
        }
        widget_${id}.update($data);
      }.bind(this, '${id}', widget_${id}));
 */

describe('component-renderer', () => {
  context('Config', () => {
    const id = 'abc'
    const component = { name: 'c', code: 'xxx' }
    const config = { a: 'b' }
    const rendered = renderer.render(id, component, config)

    it('update method is rendered', (done) => {
      expect(rendered).to.include("socket.on('abc:update', function($id, $widget, $data) {")
      done()
    })

    it('target is set correctly', (done) => {
      expect(rendered).to.include('target: document.getElementById("widget-container-abc")')
      done()
    })

    it('update method is bound', (done) => {
      expect(rendered).to.include(".bind(this, 'abc', widget_abc));")
      done()
    })

    it('default data contains config', (done) => {
      expect(rendered).to.include('data: { config: {"a":"b"} }')
      done()
    })

    it('widget update method is called', (done) => {
      expect(rendered).to.include('widget_abc.update($data);')
      done()
    })

    it('component is rendered', (done) => {
      expect(rendered).to.startWith('xxx')
      done()
    })
  })
})
