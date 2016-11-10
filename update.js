var widget = $('#' + $id + '-ci');

var icons = {
  'passed': 'check_circle',
  'failed': 'highlight_off',
  'unknown': 'help_outline',
  'running': 'update',
  'queued': 'hourglass_empty'
};

var ligature = icons[$data.status];
if ($data.error) {
  ligature = 'block';
}

widget.find('.ci-icon').html(ligature);
