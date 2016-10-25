window.widgets = window.widgets || {}

if (!window.widgets.VudashGague) {

  var gauge = function (elem) {
    this.elem = $(elem);
  }

  gauge.prototype.update = function (value) {
    var percentage = value / 100;
    var degrees = 180 * percentage;
    var pointerDegrees = degrees - 90;
    var spinner = this.elem.find('.spinner');
    var pointer = this.elem.find('.pointer');
    $(spinner).attr('style', 'transform: rotate(' + degrees + 'deg)');
    $(pointer).attr('style', 'transform: rotate(' + pointerDegrees + 'deg)');
  }

  window.widgets.VudashGague = gauge;
}
