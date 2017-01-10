'use strict'

window.VUDASH = window.VUDASH || {};
var VUDASH = window.VUDASH;

var Player = function() {};

Player.prototype.play = function(data) {
  var snd = new Audio(data);
  snd.play();
}

VUDASH.player = new Player();
