'use strict'

class ExampleWidget {

  register () {

    return {
      schedule: 1000,
      markup: "<div id="abc">def</div>",
      clientJs: "console.log('hi')",
      css: "body { color: #fff; }",
      update: "function() { return true }",

      job: (emit) => {
        emit({x: 'y'})
      }

    }

  }

}

module.exports = ExampleWidget
