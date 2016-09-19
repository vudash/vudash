var progress = $('#'+$id+'-progress');

progress.find('.bar .progress').attr('style', 'width: ' + $data.percentage + '%');
progress.find('.label').text($data.description);
