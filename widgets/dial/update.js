var oldValue = $widget.component.getValue();
var ctr = 0, from, to, maths;

function wrap(val) {
  return function() {
    $widget.component.setValue(val);
  }
}

if (oldValue > $data.value) {
  for (var i = oldValue; i > $data.value; i--) {
    ctr = ctr + 5;
    setTimeout(wrap(i), ctr);
  }
} else {
  for (var i = oldValue; i < $data.value; i++) {
    ctr = ctr + 5;
    setTimeout(wrap(i), ctr);
  }
}
