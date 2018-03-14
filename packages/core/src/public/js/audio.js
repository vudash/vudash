'use strict'

var VUDASH = window.VUDASH

var Player = function () {
  this.audio = new Audio();
}

Player.prototype.play = function (data) {
  this.audio.src = data
  this.audio.addEventListener('canplaythrough', function() {
    this.play();
  });
}

VUDASH.player = new Player()
