document.getElementById($id+'_value').innerHTML = $data.value;

var data = {
  series: [
    {
      data: $data.history
    }
  ]
};

var options = {
  axisX: {
    showLabel: false,
    showGrid: false
  },
  axisY: {
    showLabel: false,
    showGrid: false
  },
  showPoint: false,
  showArea: true,
  fullWidth: true,
  width: '100%'
}

new Chartist.Line('#'+$id+'-chart', data, options);