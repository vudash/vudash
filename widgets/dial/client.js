var dial = document.querySelector('#' + $id + '-dial');
$widget.component = new TkAudial(dial, $widget.config);
document.querySelector('#' + $id + '-dial-container .label').innerHTML = $widget.config.description;
