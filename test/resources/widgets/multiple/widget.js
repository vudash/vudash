'use strict'

class NeutralWidget {

  register () {
    return {
      clientJs: ['one.js', 'two.js'],
      css: ['one.css', 'two.css'],
      markup: 'markup.html'
    }
  }

}

module.exports = NeutralWidget
