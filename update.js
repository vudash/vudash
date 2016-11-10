var widget = $('#' + $id + '-ci');

var icons = {
  'passed': 'check circle',
  'failed': 'highlight off',
  'unknown': 'help outline',
  'running': 'update',
  'queued': 'hourglass empty'
};

var ligature = icons[$data.status];
if ($data.error) {
  ligature = 'block';
}

widget.find('.ci-icon').html(ligature);
