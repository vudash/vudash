var dial = document.querySelector('#' + $id + '-dial');
$widget.component = new TkAudial(dial, {
  type:'balance',
  display:'fill',
  min: 0,
  max: 100,
  step: 5,
  value: 0,
  borderWidth: 0,
  indicatorWidth: 35,
  indicatorBackgroundColour: 'orange	',
  indicatorColour: 'yellow',
  valueBackgroundColour: 'grey',
  valueColour: 'rgba(255,255,255,0.85)',
  valueFontSize: '65px',
  enableClipboard: false
});
