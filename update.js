var widget = $('#' + $id + '-ci');

var icons = {
  'passed': 'check circle',
  'failed': 'cancel',
  'unknown': 'help',
  'running': 'play circle filled',
  'queued': 'playlist add check'
};

var ligature = icons[$data.status];
if ($data.error) {
  ligature = 'block';
}

widget.find('.ci-icon').html(ligature);
