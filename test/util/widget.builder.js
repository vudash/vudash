const Promise = require('bluebird').Promise

class WidgetBuilder {
  constructor () {
    this.widget = this._createWidgetModule()
    this.position = { x: 0, y: 0, w: 0, h: 0 }
    this.css = 'test/resources/widgets/example/style.css'
    this.markup = 'test/resources/widgets/example/markup.html'
    this.js = 'js'
  }

  _createWidgetModule (internals = { schedule: 1000, job: () => { return Promise.resolve() } }) {
    internals.js = this.js
    internals.css = this.css
    internals.markup = this.markup

    return class MyWidget {
      register () {
        return internals
      }
    }
  }

  withCss (css) {
    this.css = css
    return this
  }

  withMarkup (markup) {
    this.markup = markup
    return this
  }

  withJs (js) {
    this.js = js
    return this
  }

  withJob (job = Promise.resolve(), schedule = 1000) {
    this.widget = this._createWidgetModule({ job, schedule })
    return this
  }

  build () {
    return {
      position: this.position,
      widget: this.widget
    }
  }
}

module.exports = {
  create: () => { return new WidgetBuilder() }
}
