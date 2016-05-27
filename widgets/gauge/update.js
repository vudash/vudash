function (id, data) {

  $('#'+id+'-progress').progress({
    percent: data.percentage
  });

  $('#'+id+'-progress .label').text(data.description);
}
