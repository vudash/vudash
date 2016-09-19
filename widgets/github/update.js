var mappings = {
  error: 'sentiment_very_dissatisfied',
  good: 'sentiment_satisfied',
  minor: 'sentiment_neutral',
  major: 'sentiment_dissatisfied'
}

document.getElementById($id+'_icon').innerHTML = mappings[$data.status];
document.getElementById($id+'_updated').innerHTML = $data.updated;
