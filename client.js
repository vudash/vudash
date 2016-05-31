var widget = $('#' + $id + '-travis');
widget.find('.travis-user').html($widget.config.user);
widget.find('.travis-repo').html($widget.config.repo);
