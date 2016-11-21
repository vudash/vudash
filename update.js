$widget.component = $widget.component || new window.widgets.VudashGague('#'+$id+'-gauge', {
  min: $data.min,
  max: $data.max
});
$widget.component.update($data.value);
