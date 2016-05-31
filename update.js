var widget = $('#' + $id + '-travis');

var icons = {
  'unknown': 'yellow warning sign',
  'passed': 'green check square',
  'failed': 'red minus square'
};

var classes = icons[$data.state];
widget.find('.travis-icon').removeClass('warning sign check square minus').addClass(classes);
