window.widgets = window.widgets || {}

if (!window.widgets.VudashGague) {

  var gauge = function (elem, options) {
    this.elem = $(elem);
    var range = options.max - options.min;
    this.pipSize = range / 100;
  }

  gauge.prototype.update = function (value) {
    var percentage = this.pipSize * ( value / 100 );
    var degrees = ( 180 / 100 ) * percentage;
    var pointerDegrees = degrees - 90;
    var spinner = this.elem.find('.spinner');
    var pointer = this.elem.find('.pointer');
    $(spinner).attr('style', 'transform: rotate(' + degrees + 'deg)');
    $(pointer).attr('style', 'transform: rotate(' + pointerDegrees + 'deg)');
  }

  window.widgets.VudashGague = gauge;
}
