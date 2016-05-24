function (id, data) {
  var classes = '';
  if (data.on) {
    classes = 'small';
  }
  document.getElementById(id+'_heart').classList = 'heartbeat icon '+classes;
}
