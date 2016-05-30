var dial = document.querySelector('#' + $id + '-dial');
var audial = new TkAudial(dial, {
  type:'balance',
  display:'notch',
  min:-50,
  max:60,
  step:4.9,
  value:0,
  borderWidth:0,
  indicatorWidth:25,
  indicatorBackgroundColour:'orange	',
  indicatorColour:'yellow',
  valueBackgroundColour:'grey',
  valueColour:'rgba(255,255,255,0.85)',
  inputId:'dial-3-input',
  enableClipboard:true
});
