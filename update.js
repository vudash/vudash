var widget = $('#' + $id + '-travis');

var icons = {
  'unknown': 'error',
  'passed': 'check circle',
  'failed': 'cancel'
};

var ligature = icons[$data.state];
widget.find('.travis-icon').innerHtml = ligature;
